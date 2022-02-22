#include <netinet/in.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <csignal>
#include <thread>
#include <fstream>
#include <utility>

#include "utils.h"
#include "logger.h"
#include "config.h"
#include "httpserver.h"

namespace psi {

    static std::pair<int, std::string> EMPTY_CONNECTION = {-1, ""};

    HTTPServer::HTTPServer(const std::string &ip, uint16_t port, uint32_t workers, std::string workDir) : m_workDir(std::move(workDir)) {
        initServer(ip, port, workers);
    }

    void HTTPServer::initServer(const std::string &ip, uint16_t port, uint32_t workers) {
        createFileDescriptor();
        attachSocketToPort();
        bindServer(ip, port);
        setListen();
        initClientHandlers(workers);
    }

    void HTTPServer::initClientHandlers(uint32_t workers) {
        for (uint32_t i = 0; i < workers; i++) {
            std::thread threadHandler(&psi::HTTPServer::clientHandler, this);
            threadHandler.detach();
        }
    }

    void HTTPServer::createFileDescriptor() {
        LOG_BOOTING("creating a socket file descriptor");
        if ((m_serverFd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
            LOG_ERR("creating the socket file descriptor failed");
            exit(EXIT_FAILURE);
        }
    }

    void HTTPServer::attachSocketToPort() const {
        LOG_BOOTING("attaching the socket to the port");
        int opt = 1;
        if (setsockopt(m_serverFd, SOL_SOCKET, SO_REUSEADDR , &opt, sizeof(opt))) {
            LOG_ERR("attaching the socket to the port failed");
            exit(EXIT_FAILURE);
        }
    }

    void HTTPServer::bindServer(const std::string &ip, uint16_t port) {
        LOG_BOOTING("binding the server");
        m_serverAddress.sin_family = AF_INET;
        m_serverAddress.sin_addr.s_addr = inet_addr(ip.c_str());
        m_serverAddress.sin_port = htons(port);

        signal(SIGPIPE, SIG_IGN);

        if (bind(m_serverFd, reinterpret_cast<struct sockaddr *>(&m_serverAddress), sizeof(m_serverAddress)) < 0) {
            LOG_ERR("binding the server failed");
            exit(EXIT_FAILURE);
        }
    }

    void HTTPServer::setListen() const {
        LOG_BOOTING("setting listening");
        if (listen(m_serverFd, 5) < 0) {
            LOG_ERR("listening failed");
            exit(EXIT_FAILURE);
        }
    }

    void HTTPServer::addNewClient(int socket, const std::string &ip) {
        const std::lock_guard<std::mutex> lock(m_clientsMtx);
        m_clients.push({socket, ip});
        m_clientsCv.notify_one();
    }

    std::pair<int, std::string> HTTPServer::getClientToProcess() {
        const std::lock_guard<std::mutex> lock(m_clientsMtx);
        if (m_clients.empty()) {
            return EMPTY_CONNECTION;
        } else {
            auto client = m_clients.front();
            m_clients.pop();
            return client;
        }
    }

    void HTTPServer::clientHandler() {
        std::pair<int, std::string> client;

        while (true) {
            client = getClientToProcess();
            if (client == EMPTY_CONNECTION) {
                std::unique_lock<std::mutex> lock(m_clientsMtx);
                m_clientsCv.wait(lock);
            } else {
                handleClient(client);
            }
        }
    }

    void HTTPServer::clientActivityTimeout(bool *exit) {
        int steps = CLIENT_TIMEOUT_MS / CLIENT_TIMEOUT_CHECK_PERIOD_MS;
        for (int i = 0; i < steps; i++) {
            if (*exit) {
                return;
            }
            usleep(utils::msToUs(CLIENT_TIMEOUT_CHECK_PERIOD_MS));
        }
        *exit = true;
    }

    void HTTPServer::handleClient(std::pair<int, std::string> &client) {
        fd_set sockets;
        FD_ZERO(&sockets);
        struct timeval timeout{};

        bool exit = false;
        std::thread clientTimer(&psi::HTTPServer::clientActivityTimeout, this, &exit);

        while (!exit) {
            FD_SET(client.first, &sockets);
            timeout.tv_sec  = 0;
            timeout.tv_usec = SECONDS_SOCKETS_TIMEOUT_US;
            select(FD_SETSIZE, &sockets, nullptr, nullptr, &timeout);

            if (FD_ISSET(client.first, &sockets)) {
                processRequest(client);
                exit = true;
                break;
            }
        }
        close(client.first);
        LOG_INFO("client (" + client.second + ") has been disconnected");
        clientTimer.join();
    }

    void HTTPServer::processRequest(std::pair<int, std::string> &client) {
        char buffer[BUFF_SIZE];
        std::string message;
        std::string filePath;

        utils::receiveData(client.first, buffer, BUFF_SIZE - 1);
        message = utils::getFirstLine(buffer);

        if (utils::isValidHTTPGETRequest(message)) {
            filePath = utils::getRequestedFilePath(message);
            if (utils::isSecurePath(filePath)) {
                LOG_INFO("client (" + client.second + ") has requested GET " + filePath);
                sendResponse(client, filePath);
            } else {
                LOG_WARNING("client (" + client.second + ") has requested a malicious path " + filePath);
            }
        } else {
            LOG_WARNING("client (" + client.second + ") sent an invalid GET REQUEST");
        }
    }

    void HTTPServer::sendResponse(std::pair<int, std::string> &client, const std::string &filePath) {
        std::string response;
        std::ifstream file = std::ifstream(m_workDir + filePath);
        if (file.fail()) {
            LOG_ERR("could not read the content of the file");
            response = utils::createHTTPHeader(HTTP_V1, HTTP_STATUS_FILE_NOT_FOUND);
        } else {
            response = utils::createHTTPHeader(HTTP_V1, HTTP_STATUS_OK);
            response += {std::istreambuf_iterator<char>{file},std::istreambuf_iterator<char>{}};
        }
        utils::sendData(client.first, response.c_str(), response.length());
    }

    void HTTPServer::run() {
        LOG_BOOTING("<[ SERVER STARTED ]>");

        int socket;
        std::string clientIp;
        int addressLen = sizeof(m_serverAddress);
        constexpr int serverDelay = SERVER_DELAY_MS * 1000;

        auto address = reinterpret_cast<struct sockaddr *>(&m_serverAddress);
        auto socketLenPtr = reinterpret_cast<socklen_t *>(&addressLen);

        while (true) {
            if ((socket = accept(m_serverFd, address, socketLenPtr)) < 0) {
                LOG_ERR("accepting a socket failed");
                exit(EXIT_FAILURE);
            }
            clientIp = utils::ip_str(m_serverAddress);
            addNewClient(socket, clientIp);

            LOG_INFO("new client (" + clientIp + ") just connected to the server");
            usleep(serverDelay);
        }
    }
}