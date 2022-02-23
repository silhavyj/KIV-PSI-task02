#pragma once

#include <string>
#include <vector>
#include <netinet/in.h>

/// General helper functions used throughout the project.
namespace psi::utils {

    /// Converts sockaddr_in into a readable ip address - dot format (e.g. 127.0.0.1)
    /// \param address address to be converted
    /// \return converted ip address in a string format
    std::string ip_str(struct sockaddr_in address);

    /// Reads data off of a socket.
    /// \param socket socket the data will read off
    /// \param buffer buffer into which the data will be stored
    /// \param bytes maximum number of bytes to be read from off the socket
    void receiveData(int socket, char *buffer, size_t bytes);

    /// Sends data through a socket.
    /// \param socket socket the data will be sent through
    /// \param buffer buffer that holds the data
    /// \param bytes number of bytes to be sent through
    void sendData(int socket, const char *buffer, size_t bytes);

    /// Check if the string is a valid HTTP request.
    /// Due to the simplicity of the server, all we need to care
    /// about is if the request starts with 'GET <path> HTTP/1.1'
    /// \param request request received from a client
    /// \return true, if the request is a valid HTTP request. False, otherwise.
    bool isValidHTTPGETRequest(const std::string &request);

    /// Splits the string given as a parameters into tokens
    /// \param str string to be split up
    /// \param separator the deliminator by which the text will be split up
    /// \return tokens
    std::vector<std::string> split(const std::string& str, char separator);

    /// Returns the path of a file the user has requests.
    /// 'GET <path> HTTP/1.1'
    /// \param request HTTP GET request
    /// \return <path>
    std::string getRequestedFilePath(const std::string &request);

    /// Returns the first line of a junk of text
    /// \param text piece of text we want to get the first line of
    /// \return the first line of the text
    std::string getFirstLine(const std::string &text);

    /// Checks if a path is secure. A path is considered secured
    /// if it doesn't contain '..' or '.'.
    /// \param path path we want to check
    /// \return true, if the path is secure, false otherwise.
    bool isSecurePath(const std::string &path);

    /// Creates an HTTP header that will be included in every
    /// response sent back to the client.
    /// \param version HTTP version
    /// \param code status code
    /// \return HTTP header, e.g. 'HTTP/1.1 200\n\n'
    std::string createHTTPHeader(const std::string &version, int code);

    /// Converts milliseconds into microseconds.
    /// \param ms number of milliseconds
    /// \return number of microseconds
    int msToUs(int ms);
}