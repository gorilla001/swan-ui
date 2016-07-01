#!/usr/bin/env bash

#frontend
sed -i "s#APIURL#$FRONTEND_APIURL#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#MARKET#$FRONTEND_MARKET#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#STREAMING#$FRONTEND_STREAMING#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#ENVIRONMENT#$FRONTEND_ENVIRONMENT#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#OFFLINE#$FRONTEND_OFFLINE#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#LOCAL_DM_HOST#$FRONTEND_LOCAL_DM_HOST#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#AGENT_URL#$FRONTEND_AGENT_URL#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#BODY_DOMAIN#$FRONTEND_BODY_DOMAIN#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#LICENCEON#$FRONTEND_LICENCEON#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#GROUP_URL#$FRONTEND_GROUP_URL#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#DEMO_URL#$FRONTEND_DEMO_URL#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#DEMO_USER#$FRONTEND_DEMO_USER#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#OFF_LINE_IMAGE_URL#$FRONTEND_OFF_LINE_IMAGE_URL#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#LOCAL_DM_HOST#$FRONTEND_LOCAL_DM_HOST#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js
sed -i "s#AGENT_URL#$FRONTEND_AGENT_URL#g" /usr/share/nginx/html/dashboard.shurenyun.com/js/confdev.js

#nginx
sed -i "s#NGINX_USER#$NGINX_USER#g" /etc/nginx/nginx.conf
sed -i "s#NGINX_WORKER_PROCESSES#$NGINX_WORKER_PROCESSES#g" /etc/nginx/nginx.conf
sed -i "s#NGINX_WORKER_CONNECTIONS#$NGINX_WORKER_CONNECTIONS#g" /etc/nginx/nginx.conf
sed -i "s#CONF_DASHBOARD_SERVERNAME#$CONF_DASHBOARD_SERVERNAME#g" /etc/nginx/conf.d/dashboard.dataman-inc.net.conf
sed -i "s#CONF_DASHBOARD_LISTEN_PORT#$CONF_DASHBOARD_LISTEN_PORT#g" /etc/nginx/conf.d/dashboard.dataman-inc.net.conf