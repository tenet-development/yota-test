FROM node:12.18.2-buster-slim

RUN apt-get update && apt-get -y upgrade && apt-get -y dist-upgrade && apt-get install -y alien libaio1 wget
RUN wget https://download.oracle.com/otn_software/linux/instantclient/19600/oracle-instantclient19.6-basic-19.6.0.0.0-1.x86_64.rpm
RUN alien -i --scripts oracle-instantclient*.rpm
RUN rm -f oracle-instantclient19.6*.rpm && apt-get -y autoremove && apt-get -y clean

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install --progress=false
RUN npm run build

CMD ["node", "dist/main.js"]
