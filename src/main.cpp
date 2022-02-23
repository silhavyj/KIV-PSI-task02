#include <cstdint>

#include "cxxopts.hpp"
#include "httpserver.h"
#include "config.h"

/// Default entry point of the application.
/// \param argc number of arguments passed in from the terminal
/// \param argv arguments passed from the terminal
/// \return 0, if the execution was successful. Otherwise, EXIT_FAILURE is returned.
int main(int argc, char *argv[]) {
    // Create an instance of an argument parser and create a basic description of the application.
    cxxopts::ParseResult arg;
    cxxopts::Options options("./kiv-psi-task02-silhavyj", "Multi-threaded HTTP server");

    // Add a list of all options the application can be run with.
    options.add_options()
        ("i,ip", "IP address the server will be bind to", cxxopts::value<std::string>()->default_value(psi::config::DEFAULT_IP))
        ("p,port", "Port the server will run on", cxxopts::value<uint16_t>()->default_value(std::to_string(psi::config::DEFAULT_PORT)))
        ("t,threads", "Size of the thread pool", cxxopts::value<uint32_t>()->default_value(std::to_string(psi::config::DEFAULT_NUMBER_OF_THREADS)))
        ("d,directory", "Working directory", cxxopts::value<std::string>()->default_value(psi::config::DEFAULT_WORKING_DIR))
        ("h,help" , "prints help")
        ;

    // Parse all arguments the user passed into the application.
    // If they've entered 'help', print out the help menu and terminate the application.
    arg = options.parse(argc, argv);
    if (arg.count("help")) {
        std::cout << options.help() << std::endl;
        return 0;
    }

    // Retrieve all parameters, the server will start with.
    const std::string ip = arg["ip"].as<std::string>();
    const uint16_t port = arg["port"].as<uint16_t>();
    const uint32_t threads = arg["threads"].as<uint32_t>();
    const std::string directory = arg["directory"].as<std::string>();

    // Start up the server.
    psi::HTTPServer httpServer(ip, port, threads, directory);
    httpServer.run();

    // The execution should not get to this point as it gets stuck in an infinite loop.
    return 0;
}