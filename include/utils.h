#pragma once

#include <string>
#include <vector>
#include <netinet/in.h>

namespace psi::utils {

    std::string ip_str(struct sockaddr_in address);
    void receiveData(int socket, char *buffer, size_t bytes);
    void sendData(int socket, const char *buffer, size_t bytes);
    bool isValidHTTPGETRequest(const std::string &request);
    std::vector<std::string> split(const std::string& str, char separator);
    std::string getRequestedFilePath(const std::string &request);
    std::string getFirstLine(const std::string &text);
    bool isSecurePath(const std::string &path);
    std::string createHTTPHeader(const std::string &version, int code);
    int msToUs(int ms);
}