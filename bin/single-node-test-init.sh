#! /usr/bin/env bash

apt-get update
apt-get install -y curl python3-pip python3-dev

# install docker
curl -sSL https://get.daocloud.io/docker | sh

# config daocloud docker service
curl -sSL https://get.daocloud.io/daomonit/install.sh | sh -s db711c62a02c66046d0c6f8a5d7622135017663d
dao pull rabbitmq:latest
dao pull mysql:latest
dao pull nginx:latest
dao pull redis:latest

# clone source code
# git clone https://github.com/Dataman-Cloud/Omega.git
git clone --depth 1 -b master --single-branch https://github.com/Dataman-Cloud/Omega.git

cd Omega/

# install python dependencies
pip3 install -r omega/omega/requirements.txt

# config nginx & js redirect
sed -i "s/SERVER_NAME/$SERVER_NAME/g" conf/dataman/nginx.conf
sed -i "s/APP/$APP/g" conf/dataman/nginx.conf
sed -i "s/SERVER_NAME/$SERVER_NAME/g" conf/dataman/nginx-market.conf
sed -i "s/DASHBOARD/$DASHBOARD/g" glance/js/confdev.js
sed -i "s/FILE_SCRIPTS/$DASHBOARD/g" glance/js/confdev.js
sed -i "s/MARKET/$MARKET/g" glance/js/confdev.js
sed -i "s/DASHBOARD/$DASHBOARD/g" user/js/conf.js
sed -i "s/BODY_DOMAIN/$BODY_DOMAIN/g" user/js/conf.js
sed -i "s/DASHBOARD/$DASHBOARD/g" omega-agent/contrib/install-agent.sh

# start nginx containers
bin/start-nginx-container-for-site-dataman.sh
sleep 5;

cd omega
make init
sleep 10;
make create-db
make init-db
mkdir /var/log/omega
(./run.sh&)
