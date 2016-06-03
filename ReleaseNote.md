* [confdev.js](https://github.com/Dataman-Cloud/frontend/blob/master/glance/js/confdev.js) 添加DEMO_USER_EMAIL配置。
* frontend的nginx需要加入配置：

        location /auth {
          try_files $uri /auth-index.html;
        }
* [confdev.js](https://github.com/Dataman-Cloud/frontend/blob/master/glance/js/confdev.js) 添加DOMAIN配置。

