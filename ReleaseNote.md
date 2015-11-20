Release Note
=============

这个文件将会记录:

- 下次release运维需要更新的配置
- 重大的bug fix
- 重大的feature

##Pending release changes

###需要运维更新

1. agentConfig.version从confdev.js中移除。（agent的版本会由后台返回）
2. user/js/conf.js 修改配置
   ```bash
   sed -i "s#ENVIRONMENT#dev#g" user/js/conf.js
   sed -i "s#MARKET#devwww.dataman-int.net#g" user/js/conf.js
   ```
demo 环境将 dev 改成 demo，devwww.dataman-int.net 改成demowww.dataman-inc.net
prod 环境将 dev 改成 prod，devwww.dataman-int.net 改成www.shurenyun.com


### bug fix


### feature

