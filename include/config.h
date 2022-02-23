#pragma once

#include <cstdint>

/// Default values (parameters) of the server. All these values
/// can be adjusted by the user upon the start of the application.
namespace psi::config {

    /// Default IP address the server will be bounded to.
    static constexpr const char *DEFAULT_IP = "127.0.0.1";

    /// Default port the server will run on.
    static constexpr uint16_t DEFAULT_PORT = 8080;

    /// Default number of threads (workers) processing requests from clients.
    static constexpr uint32_t DEFAULT_NUMBER_OF_THREADS = 10;

    /// Default working directory. All files in this directory
    /// will be accessible (exposed) thought the server interface (GET request).
    static constexpr const char *DEFAULT_WORKING_DIR = "./";
}