#! /usr/bin/env bash

docker run -p 8000:443 --name omega-glance -v $(pwd)/omega-agent/contrib/install-agent.sh:/data/install.sh:ro -v $(pwd)/glance:/usr/share/nginx/html:ro -v $(pwd)/conf/dataman/nginx.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/conf/dataman/ssl/ssl_certificate.crt:/etc/nginx/ssl_certificate.crt:ro -v $(pwd)/conf/dataman/ssl/www.dataman.io-no-passphrase.key:/etc/nginx/www.dataman.io-no-passphrase.key:ro -d nginx

#Open the comments when testing the compression
#docker run -p 8000:443 --name omega-glance -v $(pwd)/omega-agent/contrib/install-agent.sh:/data/install.sh:ro -v $(pwd)/glance/build:/usr/share/nginx/html:ro -v $(pwd)/conf/dataman/nginx.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/conf/dataman/ssl/ssl_certificate.crt:/etc/nginx/ssl_certificate.crt:ro -v $(pwd)/conf/dataman/ssl/www.dataman.io-no-passphrase.key:/etc/nginx/www.dataman.io-no-passphrase.key:ro -d nginx

docker run -p 8001:443 --name omega-market -v $(pwd)/user:/usr/share/nginx/html:ro -v $(pwd)/conf/dataman/nginx-market.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/conf/dataman/ssl/ssl_certificate.crt:/etc/nginx/ssl_certificate.crt:ro -v $(pwd)/conf/dataman/ssl/www.dataman.io-no-passphrase.key:/etc/nginx/www.dataman.io-no-passphrase.key:ro -d nginx

#Open the comments when testing the compression
#docker run -p 8001:443 --name omega-market -v $(pwd)/user/build:/usr/share/nginx/html:ro -v $(pwd)/conf/dataman/nginx-market.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/conf/dataman/ssl/ssl_certificate.crt:/etc/nginx/ssl_certificate.crt:ro -v $(pwd)/conf/dataman/ssl/www.dataman.io-no-passphrase.key:/etc/nginx/www.dataman.io-no-passphrase.key:ro -d nginx
