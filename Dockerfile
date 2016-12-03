################################################################################
# Dockerfile to build an image for training and evaluating classification 
# and prediction models using Vowpal Wabbit and perf
# Based on Ubuntu
################################################################################

# Set the base image to Ubuntu
FROM ubuntu:latest

# File Author / Maintainer
MAINTAINER Brian Abelson "brianabelson@gmail.com"

# Update the repository sources list
RUN apt-get update

# Install VW build prerequisites
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install build-essential
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install automake
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install autoconf
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install libxmu-dev
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install gcc
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install libpthread-stubs0-dev
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install libtool
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install libboost-program-options-dev
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install libboost-python-dev
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install zlib1g-dev
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install libc6
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install libgcc1
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -q install libstdc++6

# Install Git
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q git

# Add /usr/local/lib to LD_LIBRARY_PATH
ENV LD_LIBRARY_PATH $LD_LIBRARY_PATH:/usr/local/lib

# Install and make vw (Vowpal Wabbit) and perf
RUN cd /usr/local/src; git clone https://github.com/bradleypallen/vowpal_wabbit.git; cd vowpal_wabbit; ./autogen.sh; ./configure; make; make test; make install

# Install Git
RUN DEBIAN_FRONTEND=noninteractive apt-get install nodejs
RUN DEBIAN_FRONTEND=noninteractive apt-get install npm

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install -g

EXPOSE 3000

RUN ["vw-server"]


