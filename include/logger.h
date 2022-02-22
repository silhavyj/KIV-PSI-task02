#pragma once

#include <string>
#include <mutex>

#define LOG_ERR(msg)     (Logger::getInstance().log(__LINE__, Logger::ERROR,   (msg)))
#define LOG_INFO(msg)    (Logger::getInstance().log(__LINE__, Logger::INFO,    (msg)))
#define LOG_BOOTING(msg) (Logger::getInstance().log(__LINE__, Logger::BOOTING, (msg)))
#define LOG_WARNING(msg) (Logger::getInstance().log(__LINE__, Logger::WARNING, (msg)))

class Logger {
public:
    static constexpr const char *RESET   = "\033[0m";
    static constexpr const char *RED     = "\033[31m";
    static constexpr const char *GREEN   = "\033[32m";
    static constexpr const char *YELLOW  = "\033[33m";
    static constexpr const char *MAGENTA = "\033[35m";

    enum Type {
        ERROR,
        INFO,
        BOOTING,
        WARNING
    };

private:
    static constexpr const char *logDirectory = "log";
    std::string m_logFileName;
    std::mutex m_fileMtx;

private:
    Logger();
    void log(int lineNumber, const std::string &type, const std::string &color, const std::string &msg);
    static std::string getCurrentDateTime();
    void addToLogFile(const std::string &log);

public:
    Logger(Logger &) = delete;
    void operator=(Logger const &) = delete;
    static Logger &getInstance();
    void log(int lineNumber, Type type, const std::string &msg);
};