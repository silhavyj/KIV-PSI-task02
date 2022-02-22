#pragma once

#include <queue>
#include <string>
#include <cstdint>
#include <mutex>
#include <netinet/in.h>
#include <condition_variable>

namespace psi {

    class HTTPServer {
    private:
        static constexpr const char *HTTP_V1 = "1.1";
        static constexpr int HTTP_STATUS_OK = 200;
        static constexpr int HTTP_STATUS_FILE_NOT_FOUND = 404;
        static constexpr int BUFF_SIZE = 1 << 10;
        static constexpr int SERVER_DELAY_MS = 50;
        static constexpr int SECONDS_SOCKETS_TIMEOUT_US = 10000;
        static constexpr int CLIENT_TIMEOUT_MS = 5000;
        static constexpr int CLIENT_TIMEOUT_CHECK_PERIOD_MS = 200;

    private:
        int m_serverFd {};
        std::queue<std::pair<int, std::string>> m_clients;
        struct sockaddr_in m_serverAddress {};
        std::mutex m_clientsMtx;
        std::condition_variable m_clientsCv;
        std::string m_workDir;

    private:
        void initServer(const std::string &ip, uint16_t port, uint32_t workers);
        void createFileDescriptor();
        void attachSocketToPort() const;
        void bindServer(const std::string &ip, uint16_t port);
        void setListen() const;
        void addNewClient(int socket, const std::string &ip);
        void clientHandler();
        void handleClient(std::pair<int, std::string> &client);
        void processRequest(std::pair<int, std::string> &client);
        void sendResponse(std::pair<int, std::string> &client, const std::string &filePath);
        void initClientHandlers(uint32_t workers);
        void clientActivityTimeout(bool *exit);
        std::pair<int, std::string> getClientToProcess();

    public:
        HTTPServer(const std::string &ip, uint16_t port, uint32_t workers, std::string workDir);
        void run();
    };
}