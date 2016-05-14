(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoListCtrl', RepoListCtrl);


    /* @ngInject */
    function RepoListCtrl(repoBackend) {
        var self = this;

        self.repositories = [];
        self.categories = [];
        self.repoImageBaseUrl = IMAGE_BASE_URL[RUNNING_ENV] + 'app_catalog_icons/';
        self.filterCategory = filterCategory;
        ////

        activate();

        function activate() {
            listRepository();
            listCategories();
        }

        function listRepository() {
            self.repositories = [
                {
                    "id": 43,
                    "name": "redis",
                    "projectName": "library",
                    "projectId": 1,
                    "userName": "dm_dev",
                    "category": "缓存",
                    "isPublic": 1,
                    "latestTag": "latest",
                    "description": "Redis是一个开源的使用ANSI",
                    "readme": "# Redis\n",
                    "dockerCompose": "mysql:\n  image:  devregistry.dataman-inc.com:5000/library/redis\n  restart: always\n  ports:\n    - \"${default_port}:6379\"\n  cmd:\n    - \"redis-server --appendonly yes\"\n",
                    "marathonConfig": "mysql:\n  appName: \"redis\"\n  imageVersion: \"latest\"\n  cpu: 0.1\n  mem: 16\n  instances: 1\n",
                    "catalog": "name: \"redis\"\nversion: \"latest\"\ndescription: \"Redis\"\nquestions:\n  - variable: \"default_port\"\n    label: \"默认端口号\"\n    description: \"Redis默认端口号\"\n    required: false\n    type: \"string\"\n    default: \"6379\"\n",
                    "questions": "",
                    "createdAt": "2016-05-10T11:58:49+08:00",
                    "updatedAt": "2016-05-10T11:58:49+08:00"
                },
                {
                    "id": 9,
                    "name": "nginx",
                    "projectName": "library",
                    "projectId": 1,
                    "userName": "admin",
                    "category": "web服务器",
                    "isPublic": 1,
                    "latestTag": "latest",
                    "description": "Nginx是一个高性能的HTTP和反向代理服务器,也是一个IMAP/POP3/SMTP服务器",
                    "readme": "####什么是Nginx\n\nNginx 是一款轻量级的 Web 服务器、反向代理服务器、及电子邮件（IMAP/POP3）代理服务器，并在一个 BSD-like 协议下发行。由俄罗斯的程序设计师 Igor Sysoev 所开发，供俄国大型的入口网站及搜索引擎 Rambler（俄文：Рамблер）使用。其特点是占有内存少，并发能力强，事实上 Nginx 的并发能力确实在同类型的网页服务器中表现较好.\n\n####如何使用这个镜像？\n\n#####托管静态网页内容\n \n    docker run --name some-nginx -v /some/content:/usr/share/nginx/html:ro -d index.shurenyun.com/nginx:1.9\n另外一种比上面绑定 volume 更推荐的做法是用Dockerfile生成包含网页内容的新镜像，如下所示：\n\n````\nFROM index.shurenyun.com/nginx:1.9\nCOPY static-html-directory /usr/share/nginx/html\n````\n把上面的Dockerfile和您的网页内容（static-html-directory）放在同一目录下，然后运行命令生成新镜像：\n\n    docker build -t some-content-nginx .\n\n最后启动容器：\n\n    docker run --name some-nginx -d some-content-nginx\n\n#####暴露端口\n\n    docker run --name some-nginx -d -p 8080:80 some-content-nginx\n这样启动，您就可以通过 http://localhost:8080 或者 http://宿主 IP:8080 访问 Nginx 了。\n\n#####进阶配置\n   \n    docker run --name some-nginx -v /some/nginx.conf:/etc/nginx/nginx.conf:ro -d index.shurenyun.com/nginx:1.9\n\n为了确保 Nginx 容器能够持续运行，请务必在您自定义的 Nginx 配置文件中包含deamon off配置项。\n\n下面的命令从一个正在运行的 Nginx 容器中复制出配置文件：\n\n    docker cp some-nginx:/etc/nginx/nginx.conf /some/nginx.conf\n您也可以通过推荐的Dockerfile方式来生成一个包含自定义配置文件的镜像，如下所示：\n\n````\nFROM index.shurenyun.com/nginx:1.9\nCOPY nginx.conf /etc/nginx/nginx.conf\n````\n\n再用下面的命令构建镜像：\n\n    docker build -t some-custom-nginx .\n最后启动容器：\n\n    docker run --name some-nginx -d some-custom-nginx\n\n#####支持的Docker版本\n这个镜像在 Docker 1.7.0 上提供最佳的官方支持，对于其他老版本的 Docker（1.0 之后）也能提供基本的兼容。\n\n\n\n",
                    "dockerCompose": "nginx:\n  image:  devregistry.dataman-inc.com:5000/library/nginx\n  restart: always\n",
                    "marathonConfig": "nginx:\n  appName: \"nginx\"\n  imageVersion: \"latest\"\n  cpu: 0.1\n  mem: 16\n  instances: 1\n",
                    "catalog": "name: \"nginx\"\n",
                    "questions": "",
                    "createdAt": "2016-04-20T09:41:29+08:00",
                    "updatedAt": "2016-04-20T09:41:29+08:00"
                },
                {
                    "id": 8,
                    "name": "mysql",
                    "projectName": "library",
                    "projectId": 1,
                    "userName": "admin",
                    "category": "数据库",
                    "isPublic": 1,
                    "latestTag": "latest",
                    "description": "最流行的数据库工具，高性能",
                    "readme": "MySQL是一个关系型数据库管理系统，由瑞典MySQL AB 公司开发，目前属于 Oracle 旗下公司。MySQL 最流行的关系型数据库管理系统，在 WEB 应用方面MySQL是最好的 RDBMS (Relational Database Management System，关系数据库管理系统) 应用软件之一。\n\nMySQL是一种关联数据库管理系统，关联数据库将数据保存在不同的表中，而不是将所有数据放在一个大仓库内，这样就增加了速度并提高了灵活性。\nMySQL所使用的 SQL 语言是用于访问数据库的最常用标准化语言。MySQL 软件采用了双授权政策，它分为社区版和商业版，由于其体积小、速度快、总体拥有成本低，尤其是开放源码这一特点，一般中小型网站的开发都选择 MySQL 作为网站数据库。\n\n由于其社区版的性能卓越，搭配 PHP 和 Apache 可组成良好的开发环境。\n\n",
                    "dockerCompose": "mysql:\n  image:  devregistry.dataman-inc.com:5000/library/mysql\n  restart: always\n  ports:\n    - \"${default_port}:3306\"\n  environment:\n    MYSQL_ROOT_PASSWORD: ${mysql_root_password}\n",
                    "marathonConfig": "mysql:\n  appName: \"mysql\"\n  imageVersion: \"latest\"\n  cpu: 0.1\n  mem: 16\n  instances: 1\n",
                    "catalog": "name: \"mysql\"\nversion: \"v5.6\"\ndescription: \"MySQL\"\nquestions:\n  - variable: \"mysql_root_password\"\n    label: \"初始默认密码\"\n    description: \"MySQL初始账号密码\"\n    required: true\n    type: \"string\"\n    default: \"rootroot\"\n  - variable: \"default_port\"\n    label: \"默认端口号\"\n    description: \"MySQL默认端口号\"\n    required: false\n    type: \"string\"\n    default: \"3306\"\n",
                    "questions": "",
                    "createdAt": "2016-04-20T09:39:46+08:00",
                    "updatedAt": "2016-04-20T09:39:46+08:00"
                }
            ]
            //repoBackend.listRepositories()
            //    .then(function (data) {
            //        self.repositories = data;
            //    })
        }

        function listCategories() {
            //repoBackend.listCategories()
            //    .then(function (data) {
            //        self.categories = data;
            //    })
        }

        function filterCategory(category) {
            return function (item){
                if(category){
                    return item.category === category
                }
                return true
            };
        }
    }
})();