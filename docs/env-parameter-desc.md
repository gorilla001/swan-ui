## frontend env 参数说明

- API主机地址
  + FRONTEND_APIURL=http://devforward.dataman-inc.net
- websocket地址
  + FRONTEND_STREAMING=ws://devstreaming.dataman-inc.net
- 前端地址
  + FRONTEND_MARKET=http://devwww.dataman-inc.net
- 前端环境
  + FRONTEND_ENVIRONMENT=dev
- 前端图片地址
  + FRONTEND_IMAGE_BASE_URL=FRONTEND_IMAGE_BASE_URL
- 共享集群中的应用，映射端口使用的地址
  + FRONTEND_GROUP_URL=10.3.20.51
- demo用户的应用，映射端口使用的地址
  + FRONTEND_DEMO_URL=123.59.44.221
- Demo用户邮箱地址
  + FRONTEND_DEMO_USER=demo@shurenyun.com
- 共享用户权限的域（保存cookies用）
  + FRONTEND_BODY_DOMAIN=dataman-inc.net
- 是否是离线环境
  + FRONTEND_OFFLINE=false
- 是否需要Licenceon
  + FRONTEND_LICENCEON=false
- dmHost为streaming的地址（含协议，网络地址，端口)
  + FRONTEND_LOCAL_DM_HOST=LOCAL_DM_HOST
- agent的安装脚本路径
  + FRONTEND_AGENT_URL=AGENT_URL
- docker的安装脚本路径
  + FRONTEND_DOCKER_INSTALL_SCRIPT=DOCKER_INSTALL_SCRIPT
- nginx 启动用户
  + NGINX_USER=nginx
- nginx worker 角色的进程个数
  + NGINX_WORKER_PROCESSES=4
- 每一个nginx woker进程能并发处理的最大连接数
  + NGINX_WORKER_CONNECTIONS=10240
- frontend dev首页地址
  + CONF_DASHBOARD_SERVERNAME=devdashboard.dataman-inc.net
- frontend dev 监听的端口
  + CONF_DASHBOARD_LISTEN_PORT=80
