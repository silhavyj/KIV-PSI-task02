#pragma once

#include <queue>
#include <string>
#include <cstdint>
#include <mutex>
#include <netinet/in.h>
#include <condition_variable>

namespace psi {

    /// This class represents the HTTP server. It uses a pool of threads
    /// to handle requests from clients. The thread pool size as well as
    /// other properties can be parametrized thought the constructor.
    class HTTPServer {
    private:
        /// HTTP protocol version 1.1 (header of each response)
        static constexpr const char *HTTP_V1 = "1.1";

        /// HTTP status OK (200)
        static constexpr int HTTP_STATUS_OK = 200;

        /// HTTP status FILE_NOT_FOUND (404)
        static constexpr int HTTP_STATUS_FILE_NOT_FOUND = 404;

        /// 1KB; size of the buffer reserved a request from one client
        static constexpr int BUFF_SIZE = 1 << 10;

        /// Sleep time between accepting connections
        static constexpr int SERVER_DELAY_MS = 50;

        /// Amount of microseconds as a timeout for the method select
        /// which checks if there is some data ready to be read off the socket
        static constexpr int SECONDS_SOCKETS_TIMEOUT_US = 10000;

        /// Timeout after which a client will be cut off as a result of not
        /// being "active" - security measure.
        static constexpr int CLIENT_TIMEOUT_MS = 5000;

        /// Interval to check if the client has already sent a request.
        static constexpr int CLIENT_TIMEOUT_CHECK_PERIOD_MS = 200;

    private:
        /// Server file descriptor
        int m_serverFd {};

        /// Queue of client connections. When a client connects to the server,
        /// the socket along with the ip address will be stored into a queue
        /// waiting to by processed by one of the workers.
        std::queue<std::pair<int, std::string>> m_clients;

        /// Socket address
        struct sockaddr_in m_serverAddress {};

        /// Mutex used to control access to the queue of connections
        std::mutex m_clientsMtx;

        /// Condition variable the workers will get blocked on
        /// if there is no connection to be handled -> performance
        std::condition_variable m_clientsCv;

        /// Working directory of the server
        std::string m_workDir;

    private:
        /// Initializes the server so it can be started up.
        /// \param ip address the server will be bound to
        /// \param port port the server will run on
        /// \param workers number of workers (size of the thread pool)
        void initServer(const std::string &ip, uint16_t port, uint32_t workers);

        /// Creates a new file descriptor (when the server boots up).
        void createFileDescriptor();

        /// Attaches the socket to the port (when the server boots up).
        void attachSocketToPort() const;

        /// Binds the server (when the server boots up).
        /// \param ip address the server will be bound to
        /// \param port port the server will run on
        void bindServer(const std::string &ip, uint16_t port);

        /// Sets listening fro clients (when the server boots up)
        void setListen() const;

        /// Adds a newly accepted connection to the queue of connections.
        /// \param socket client's socket
        /// \param ip client's ip address
        void addNewClient(int socket, const std::string &ip);

        /// Handles connections. This method represents one
        /// worker in the pool of threads.
        void clientHandler();

        /// Handles the request from the client.
        /// \param client socket and ip address of the client
        void handleClient(std::pair<int, std::string> &client);

        /// Processes a request from a client.
        /// \param client socket and ip address of the client
        void processRequest(std::pair<int, std::string> &client);

        /// Sends a response back to the client. The response follows
        /// the HTTP protocol version 1.1.
        /// \param client socket and ip address of the client
        /// \param filePath path to the request file
        void sendResponse(std::pair<int, std::string> &client, const std::string &filePath);

        /// Initializes the thread pool (all workers that will be processing connections).
        /// \param workers number of workers
        void initClientHandlers(uint32_t workers);

        /// This method functions as a thread that checks if the client is active.
        /// If the clients doesn't send a request to the server in under CLIENT_HANDLER_TIMEOUT_MS
        /// milliseconds after they connect, the connection will be discarded.
        /// \param exit variable used to terminate the connection
        void clientActivityTimeout(bool *exit);

        /// Returns a connection to be processed. This method is called by the workers.
        /// \return {<socket>,<ip>}, if there is a connection waiting to be processed. {-1, ""} otherwise.
        std::pair<int, std::string> getClientToProcess();

    public:
        /// Creates an instance of the server.
        /// \param ip address the server will be bound to
        /// \param port port the server will run on
        /// \param workers number of workers (size of the thread pool)
        /// \workDir working directory
        HTTPServer(const std::string &ip, uint16_t port, uint32_t workers, std::string workDir);

        /// Runs the thread accepting connections from clients.
        void run();
    };
}