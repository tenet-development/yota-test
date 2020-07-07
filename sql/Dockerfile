FROM debian:buster-slim

ARG USER=YOTA
ARG PASSWORD
ARG HOST
ARG PORT 
ARG DB

WORKDIR /opt

COPY scripts .

RUN apt-get update && apt-get -y upgrade && apt-get -y dist-upgrade && apt-get install -y alien libaio1 wget
RUN wget https://download.oracle.com/otn_software/linux/instantclient/19600/oracle-instantclient19.6-basic-19.6.0.0.0-1.x86_64.rpm
RUN wget https://download.oracle.com/otn_software/linux/instantclient/19600/oracle-instantclient19.6-sqlplus-19.6.0.0.0-1.x86_64.rpm

RUN alien -i --scripts oracle-instantclient*.rpm
RUN rm -f oracle-instantclient19.6*.rpm && apt-get -y autoremove && apt-get -y clean

RUN sqlplus "$USER"/"$PASSWORD"@"$HOST":"$PORT"/"$DB" @install

