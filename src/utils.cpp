#include <sstream>
#include <string>
#include <algorithm>

#include "utils.h"

namespace psi::utils {

    static constexpr const char *HTTP_GET = "GET";
    static constexpr const char *HTTP_V1 = "HTTP/1.1";
    static constexpr const char *CURRENT_DIR = ".";
    static constexpr const char *PARENT_DIR = "..";
    static constexpr char SLASH = '/';
    static constexpr char SPACE = ' ';
    static constexpr char NEW_LINE = '\n';

    std::string ip_str(struct sockaddr_in address) {
        char buffer[50];
        sprintf(buffer, "%d.%d.%d.%d",
            (int) (address.sin_addr.s_addr  & 0xff),
            (int) ((address.sin_addr.s_addr & 0xff00) >> 8),
            (int) ((address.sin_addr.s_addr & 0xff0000) >> 16),
            (int) ((address.sin_addr.s_addr & 0xff000000) >> 24));
        return buffer;
    }

    void receiveData(int socket, char *buffer, size_t bytes) {
        ssize_t receivedBytes = recv(socket, buffer, bytes, 0);
        buffer[receivedBytes] = '\0'; // Terminate the string
    }

    void sendData(int socket, const char *buffer, size_t bytes) {
        send(socket, buffer, bytes, 0);
    }

    bool isValidHTTPGETRequest(const std::string &request) {
        const auto parts = split(request, SPACE);
        if (parts.size() < 3) {
            return false;
        }
        return parts[0] == HTTP_GET && parts[2] == HTTP_V1;
    }

    std::vector<std::string> split(const std::string& str, char separator) {
        std::vector<std::string> tokens;
        std::stringstream ss(str);
        std::string x;
        while (getline(ss, x, separator)) {
            if (!x.empty()) {
                tokens.emplace_back(x);
            }
        }
        return tokens;
    }

    std::string getRequestedFilePath(const std::string &request) {
        const auto parts = split(request, SPACE);
        if (parts.size() < 2) {
            return "";
        }
        std::string path = parts[1];
        if (path[0] == SLASH) {
            path.erase(0, 1);
        }
        return path;
    }

    std::string getFirstLine(const std::string &text) {
        std::size_t position = text.find(NEW_LINE);
        if (position != std::string::npos) {
            std::string line = text.substr(0, position);
            while (line.length() > 0 && isspace(line[line.length() - 1])) {
                line.pop_back();
            }
            return line;
        }
        return text;
    }

    bool isSecurePath(const std::string &path) {
        const auto parts = split(path, SLASH);
        return std::all_of(parts.begin(), parts.end(), [](const auto &part) {
            return part != CURRENT_DIR && part != PARENT_DIR;
        });
    }

    std::string createHTTPHeader(const std::string &version, int code) {
        return "HTTP/" + version + " " + std::to_string(code) + "\n\n";
    }

    int msToUs(int ms) {
        return ms * 1000;
    }
}