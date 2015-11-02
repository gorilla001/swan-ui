Release Note
=============

这个文件将会记录:

- 下次release运维需要更新的配置
- 重大的bug fix
- 重大的feature

##Pending release changes

###需要运维更新

 - glance/js/confdev.js 更新了 `installScript` 字段，变为可配置项 `curl -Ls INSTALLSCRIPT_URL | sudo -H`，替换之前的 `curl -Ls https://raw.githubusercontent.com/Dataman-Cloud/agent-installer/master/install-agent.sh | sudo -H`。
 
### bug fix

1. watch on web sokcet message when axaj request resolved and charts build finished
2. wrong password max length
3. wrong password validator

### feature

1. Modify confdev.js for 'installScript'
