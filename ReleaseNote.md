Release Note
=============

这个文件将会记录:
- 下次release运维需要更新的配置
- 重大的bug fix
- 重大的feature

##Pending release changes

###需要运维更新

 - PR #3 : glance/js/confdev.js 更新了，`BACKEND_URL` 里面的 fileUrl 不需要了。
 - glance/js/confdev.js 替换 DASHBOARD 时需要前缀 https:// 或者 http://
 - glance/js/confdev.js 替换 MARKET 时需要前缀 https:// 或者 http://
 - glance/js/confdev.js 需要替换 STREAMING , 格式为： wss://streaming.dataman.io:8000 或者 ws://streaming.dataman.io:8000
 - user/js/conf.js 替换 DASHBOARD 时需要前缀 https:// 或者 http://

非生产环境需要额外update的:
 - 将 glance/js/confdev.js 里面的 dmHost 设置为相应环境的地址， 譬如： ws://devstreaming.dataman-inc.net/ ; 将 filesUrl 设置为相应的地址， 譬如： http://dev.dataman-inc.net/files
 
### bug fix

### feature
