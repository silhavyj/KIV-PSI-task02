# KIV/PSI task 02 - Multi-threaded HTTP server

This project is for academic purposes only and may potentially contain security vulnerabilities. Therefore, use it at your own risk. However, some precautions where taking during the process of implementation - see the implementation details. 

## Build

### Requirements

In order to successfully compile the application, you're required to he `cmake` installed on your machine. Additionally, this application runs on **Linux only**. To install `cmake` on a debian-based distribution, you can simply run the following command

```bash
sudo apt-get install cmake
```

### Compilation

Once you have installed `cmake` on your machine, clone this project and navigate into the root folder of the project structure. Here, you're required to run the following sequence of commands.

```bash
mkdir build && cd build && cmake .. && make
```

Upon successful execution, a file called `kiv-psi-task02-silhavyj` should be created. This file represents the executable binary of the application.

## Execution

The application does nto require any parameters to be passed in from the terminal. However, the user change a few things in order to change the behavior of the application. As a first step, run the application like so:

```bash
./kiv-psi-task02-silhavyj --help
```

You will be prompted with a help menu which tells you all the options the server can be run with.

```bash
Multi-threaded HTTP server
Usage:
  ./kiv-psi-task02-silhavyj [OPTION...]

  -i, --ip arg         IP address the server will be bind to (default: 
                       127.0.0.1)
  -p, --port arg       Port the server will run on (default: 8080)
  -t, --threads arg    Size of the thread pool (default: 10)
  -d, --directory arg  Working directory (default: ./)
  -h, --help           prints help
```

If you're planning to test the application on your local machine only, you don't have to make any changes to the IP address. However, you may want to change the default port if you happen to have another service running on the same port. You can increase the performance of the server by increasing the amount of workers - the size of the thread pool. The working directory option identifies the root directory that will be accessible through the server interface - GET requests.

### Examples

```bash
./kiv-psi-task02-silhavyj -p 8085 -t 20 -d ../data/

./kiv-psi-task02-silhavyj --port 8085 --directory ../data/
```

You can verify the server is up and running by executing the following command.

```bash
netstat -tupln | grep 8085 
```

## Logging

Once the program has started, you can notice logs being printed out to the terminal. These logs are meant to capture what the server's currently doing. They are also being stored into a file for possible further analysis. All log files are stored into the `log` folder which can be found in the root folder of the project structure.

<img src="img/01.png">

## Testing

In order to test the functionality of the application, I have included a simple website that was created as a team project when I was on Erasmus in Belfast. The website is supposed to be a horror game, and while it may not be the most efficient application as far as resources are concerned, it does send a fair amount of request to the server. It needs to pull down files such as images, sound effects, CSS, HTML, and JS. Therefore, I thought it could be a good application to be run off of this server.

Feel free to create your own testing folder with a couple of test files of your own :)

## Implementation details