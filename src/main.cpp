#include <cstdint>

#include "cxxopts.hpp"
#include "httpserver.h"
#include "config.h"

int main(int argc, char *argv[]) {
    cxxopts::ParseResult arg;
    cxxopts::Options options("./kiv-psi-task02-silhavyj", "Multi-threaded HTTP server");

    options.add_options()
            ("i,ip", "IP address the server will be bind to", cxxopts::value<std::string>()->default_value(psi::config::DEFAULT_IP))
            ("p,port", "Port the server will run on", cxxopts::value<uint16_t>()->default_value(std::to_string(psi::config::DEFAULT_PORT)))
            ("t,threads", "Size of the thread pool", cxxopts::value<uint32_t>()->default_value(std::to_string(psi::config::DEFAULT_NUMBER_OF_THREADS)))
            ("d,directory", "Working directory", cxxopts::value<std::string>()->default_value(psi::config::DEFAULT_WORKING_DIR))
            ("h,help" , "prints help")
            ;

    arg = options.parse(argc, argv);
    if (arg.count("help")) {
        std::cout << options.help() << std::endl;
        return 0;
    }

    const std::string ip = arg["ip"].as<std::string>();
    const uint16_t port = arg["port"].as<uint16_t>();
    const uint32_t threads = arg["threads"].as<uint32_t>();
    const std::string directory = arg["directory"].as<std::string>();

    psi::HTTPServer httpServer(ip, port, threads, directory);
    httpServer.run();

    return 0;
}