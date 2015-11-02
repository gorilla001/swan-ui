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
 - glance/js/confdev.js 需要替换 DM_HOST, 生产环境替换成 空字符串, 开发环境替换成譬如： DM_HOST=ws://devstreaming.dataman-inc.net/
 - glance/js/confdev.js 需要替换 FILES_URL, 生产环境替换成 空字符串, 开发环境替换成譬如： FILES_URL=http://dev.dataman-inc.net/files
 - user/js/conf.js 替换 DASHBOARD 时需要前缀 https:// 或者 http://
 - glance/js/confdev.js 更新了 `installScript` 字段，变为可配置项 `curl -Ls INSTALLSCRIPTURL | sudo -H`，替换之前的 `curl -Ls https://raw.githubusercontent.com/Dataman-Cloud/agent-installer/master/install-agent.sh | sudo -H`。
 
### bug fix

### feature
