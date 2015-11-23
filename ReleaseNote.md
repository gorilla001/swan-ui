Release Note
=============

这个文件将会记录:

- 下次release运维需要更新的配置
- 重大的bug fix
- 重大的feature

##Pending release changes

###需要运维更新
1. 需要跟新nginx配置。
    auth_request用户验证模块proxy_pass路径中的v1需要修改为v2;
    指向cluster的location路径中的v1需要修改为v2(streaming不需要修改);
    不需要auth_request验证的路径统一由auth开头，所以这部分location路径改为/api/v2/auth

### bug fix


### feature

