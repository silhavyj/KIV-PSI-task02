FROM ghcr.io/maxotta/dev-builder-c:latest AS builder
ARG CACHEBUST=0
COPY ./ /tmp/kiv-psi-task02-silhavyj/
RUN cd /tmp/kiv-psi-task02-silhavyj ; \
    cmake -S . -B build ; \
    cmake --build build ; \
    mkdir /app ; \
    cp build/kiv-psi-task02-silhavyj /app ; \
    cp -r data /app