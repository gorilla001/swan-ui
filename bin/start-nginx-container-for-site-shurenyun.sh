#! /usr/bin/env bash

docker run --net host --name omega-glance -v $(pwd)/glance:/usr/share/nginx/html:ro -v $(pwd)/conf/shurenyun/nginx.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/conf/shurenyun/ssl/certs:/etc/nginx/certs:ro -d nginx
docker run --net host --name omega-market -v $(pwd)/user:/usr/share/nginx/html:ro -v $(pwd)/conf/shurenyun/nginx-market.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/conf/shurenyun/ssl/certs:/etc/nginx/certs:ro -d nginx
