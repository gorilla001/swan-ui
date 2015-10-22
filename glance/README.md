# Glance

Omega Cloud frontend, developed by AngularJS, responsible for maintaining clusteres.


## Start development ENV

* install npm
* npm install -g bower
* bower install
* cd glance; `python3 -m http.server`
* Visit http://localhost:8000
* start [Omega](../omega/README.md) for serving RESTful backend

## Gulp build
* 在 Omega/ glance 目录下，执行 <code>docker run -it --rm --name my-running-script -v "$PWD":/usr/src/myapp -w /usr/src/myapp node:4.0 ./compress.sh</code> 命令
* 压缩成功后后在 glance目录下生成 build 目录，里面既是压缩后的文件.如要测试压缩的网页，需要修改 Nginx 容器脚本
  Omega/bin/start-nginx-container-for-site-dataman.sh 文件，将 omega-glance 的挂在目录变为/glance/build．并重新生成新的 omega-glance　容器．

start-nginx-container-for-site-dataman.sh　文件:
```
#! /usr/bin/env bash

#docker run -p 8000:443 --name omega-glance -v $(pwd)/omega-agent/contrib/install-agent.sh:/data/install.sh:ro -v $(pwd)/glance:/usr/share/nginx/html:ro -v $(pwd)/conf/dataman/nginx.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/conf/dataman/ssl/ssl_certificate.crt:/etc/nginx/ssl_certificate.crt:ro -v $(pwd)/conf/dataman/ssl/www.dataman.io-no-passphrase.key:/etc/nginx/www.dataman.io-no-passphrase.key:ro -d nginx

docker run -p 8000:443 --name omega-glance -v $(pwd)/omega-agent/contrib/install-agent.sh:/data/install.sh:ro -v $(pwd)/glance/build:/usr/share/nginx/html:ro -v $(pwd)/conf/dataman/nginx.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/conf/dataman/ssl/ssl_certificate.crt:/etc/nginx/ssl_certificate.crt:ro -v $(pwd)/conf/dataman/ssl/www.dataman.io-no-passphrase.key:/etc/nginx/www.dataman.io-no-passphrase.key:ro -d nginx

docker run -p 8001:443 --name omega-market -v $(pwd)/user:/usr/share/nginx/html:ro -v $(pwd)/conf/dataman/nginx-market.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/conf/dataman/ssl/ssl_certificate.crt:/etc/nginx/ssl_certificate.crt:ro -v $(pwd)/conf/dataman/ssl/www.dataman.io-no-passphrase.key:/etc/nginx/www.dataman.io-no-passphrase.key:ro -d nginx
```
