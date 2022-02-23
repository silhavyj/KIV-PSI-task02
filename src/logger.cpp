#include <iostream>
#include <sstream>
#include <fstream>
#include <cstring>
#include <ctime>
#include <sys/stat.h>

#include "logger.h"

namespace psi {
    Logger &Logger::getInstance() {
        static Logger instance;
        return instance;
    }

    Logger::Logger() {
        m_logFileName = getCurrentDateTime() + ".log";
        mkdir(logDirectory, S_IRWXU | S_IRWXG | S_IROTH | S_IXOTH);
    }

    void Logger::log(int lineNumber, Type type, const std::string &msg) {
        switch (type) {
            case ERROR:
                log(lineNumber, "ERROR_LOG", RED, msg);
                break;
            case INFO:
                log(lineNumber, "INFO_LOG", GREEN, msg);
                break;
            case BOOTING:
                log(lineNumber, "BOOTING_LOG", MAGENTA, msg);
                break;
            case WARNING:
                log(lineNumber, "WARNING_LOG", YELLOW, msg);
                break;
        }
    }

    void Logger::log(int lineNumber, const std::string &type, const std::string &color, const std::string &msg) {
        std::stringstream ss;
        ss << "[#" << lineNumber << "]";
        ss << "[" << getCurrentDateTime() << "]";
        ss << "[" << type << "]";
        ss << " " << msg;
        std::cout << color << ss.str() << RESET << std::endl;

        addToLogFile(ss.str());
    }

    std::string Logger::getCurrentDateTime() {
        time_t current_time;
        struct tm *time_info;
        char buffer[80];

        time(&current_time);
        time_info = localtime(&current_time);

        strftime(buffer, sizeof(buffer), "%d-%m-%Y_%H-%M-%S", time_info);
        return buffer;
    }

    void Logger::addToLogFile(const std::string &log) {
        const std::lock_guard<std::mutex> lock(m_fileMtx);
        std::ofstream logFile;
        std::string file = std::string(logDirectory) + "/" + m_logFileName;

        logFile.open(file, std::ios::out | std::ios::app);
        if (logFile.fail()) {
            throw std::ios_base::failure(std::strerror(errno));
        }

        logFile.exceptions(logFile.exceptions() | std::ios::failbit | std::ifstream::badbit);
        logFile << log << std::endl;
        logFile.close();
    }
}