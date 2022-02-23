#pragma once

#include <string>
#include <mutex>

#define LOG_ERR(msg)     (Logger::getInstance().log(__LINE__, Logger::ERROR,   (msg)))
#define LOG_INFO(msg)    (Logger::getInstance().log(__LINE__, Logger::INFO,    (msg)))
#define LOG_BOOTING(msg) (Logger::getInstance().log(__LINE__, Logger::BOOTING, (msg)))
#define LOG_WARNING(msg) (Logger::getInstance().log(__LINE__, Logger::WARNING, (msg)))

namespace psi {

    /// This class represents a logger of the server. It logs both into the terminal
    /// as well as into a log file, so it could be used for further analysis.
    class Logger {
    public:

        /// Reset color used when printing out into the terminal
        static constexpr const char *RESET   = "\033[0m";

        /// Red color used when printing out into the terminal
        static constexpr const char *RED     = "\033[31m";

        /// Green color used when printing out into the terminal
        static constexpr const char *GREEN   = "\033[32m";

        /// Yellow color used when printing out into the terminal
        static constexpr const char *YELLOW  = "\033[33m";

        /// Magenta color used when printing out into the terminal
        static constexpr const char *MAGENTA = "\033[35m";

        /// Type of a log message
        enum Type {
            ERROR,
            INFO,
            BOOTING,
            WARNING
        };

    private:
        /// Name of the directory where all log files are stored
        static constexpr const char *logDirectory = "log";

        /// Name of the log file <current datetime>.log
        std::string m_logFileName;

        /// Mutex to control access when writing into the file
        std::mutex m_fileMtx;

    private:
        /// Creates an instance of the class.
        Logger();

        /// Logs a message (prints it out in color and stores it into the log file)
        /// This method is directly called by method log in which the message gets
        /// the appropriate color depending on its type.
        /// \param lineNumber number of the line from which this log method was called
        /// \param type of the log message
        /// \param color in which the message is going to be printed out
        /// \param msg the log message itself
        void log(int lineNumber, const std::string &type, const std::string &color, const std::string &msg);

        /// Returns current datetime.
        /// This method is used when creating the log file as well
        /// as when a log method is called so the current date
        /// could be added to the log message.
        /// \return current datetime
        static std::string getCurrentDateTime();

        /// Appends the log message to the end of the log file
        /// \param log the log message
        void addToLogFile(const std::string &log);

    public:
        /// Copy constructor of the class.
        /// It was deleted because there is no need to use it within this project.
        Logger(Logger &) = delete;

        /// Assignment operator of the the class.
        /// It was deleted because there is no need to use it within this project.
        void operator=(Logger const &) = delete;

        /// Returns the instance of the class.
        /// \return the instance of the class
        static Logger &getInstance();

        /// Logs a message (prints it out and stores it into the log file).
        /// This method also keeps track of the number of the line
        /// from which the method was called so it could be added
        /// to the log message - makes the debugging process easier.
        /// \param lineNumber number of the line from which this log method was called
        /// \param type of the log message
        /// \param msg the log message itself
        void log(int lineNumber, Type type, const std::string &msg);
    };
}