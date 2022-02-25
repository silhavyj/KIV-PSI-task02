CMAKE_MINIMUM_REQUIRED(VERSION 3.0)

project(kiv-psi-task02-silhavyj)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS -pthread)

add_compile_options(-Wall -Wextra -pedantic -Werror)

INCLUDE_DIRECTORIES("${CMAKE_CURRENT_SOURCE_DIR}/include/")
INCLUDE_DIRECTORIES("${CMAKE_CURRENT_SOURCE_DIR}/lib/")

FILE(GLOB_RECURSE src_files "src/*.cpp")

ADD_EXECUTABLE(${PROJECT_NAME} ${src_files})