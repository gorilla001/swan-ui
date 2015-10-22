# Omega
Omega Cloud, Based on Mesos, Powered by DataMan

## Structure

![structure](docs/structure.png)

## Start Single-node test Env

* 向 support.dataman-inc.com 发送申请机器工单，申请一台 ubuntu 测试机，并将子域名 $EXAMPLE.dataman.io 指向该机器, 请将 $EXAMPLE 用你得公司邮箱前缀替掉，譬如 wtzhou.dataman.io 等。 （如果你已经有一台测试机了，你可以只申请域名指向)。
* 登录到测试机， 复制脚本 bin/single-node-test-init.sh 并以 sudo/root 运行 

```bash
SERVER_NAME=$EXAMPLE.dataman.io BODY_DOMAIN=dataman.io DASHBOARD=$EXAMPLE.dataman.io:8000 MARKET=$EXAMPLE.dataman.io:8001 APP=$EXAMPLE.dataman.io:8888 ./single-node-test-init.sh
```

进行测试环境初始化, 其中 $EXAMPLE 是你的域名前缀。该过程会下载必要的 docker images ， 源代码以及安装依赖等。
* 接下来， 你就可以从浏览器访问 `https://$EXAMPLE.dataman.io:8000` 进行操作了。
* DONE

## Start Development Env

* call `bin/git_precommit_pycheck.py` before commit, run the following cmd once under `project root dir`:

 ```bash
 echo 'python bin/git_precommit_pycheck.py' >> .git/hooks/pre-commit
 ```

* Read [omega README](omega/README.md) for child project `Omega`.
* Read [glance README](glance/README.md) for child project `Glance`.
* Read [user README](user/README.md) for child project `user`.
* Read [omega-agent README](omega-agent/README.md) for child project `Omega Agent`.


## code convention

* 在 git commit 信息里面全部使用英文
* 在 code comment 里面全部使用英文
* 项目里的文件名全部使用英文

### python

* 请务必使用 `bin/git_precommit_pycheck.py` 来检查你的 python 代码。 使用方法就是按[配置开发环境](#start-development-env)里的步骤进行设置。
* 遇到不清楚或冲突的地方，尽量按 pep8 的风格解决。

### javascript

* 换行缩进4个字符
* 变量名和函数名利用“小驼峰式大小写”来表示，如 myFirstName
* 在每条可执行的语句结尾添加分号

### html
* 换行缩进4个字符
* 类(class)和 id 的名称不少于两个单词时，用'-'连接各个单词，如 "my-first-name"
* 标签太长可断行处理
* AngularJS 的 directives 需加 data, 如 "data-ng-model"

### go

 * [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments) 请参考Google的代码规范

## code review

* 凡是需要跟产品经理，设计师等所有非本项目的 developer 沟通时，我们使用 [Trello](https://trello.com/b/wmnJDQ7P/shurenyun)。 它主要用来跟踪项目进度，用户故事， 较大 feature 划分，管理等；
* 纯代码相关的任务、不需要非-developer参与的，如bug, code refactor 等，我们使用[github issue](https://github.com/Dataman-Cloud/Omega/issues) 进行管理。
* developer 承担某一个具体的任务A后，它需要在这里新建一个解决该任务的 git branch A。
* developer 将实现A的 commit 提交到branch A。不要将与项目无关的内容 commit，以免困扰你的合作者。
* 另外，提交的 commit 不要引入已知的 bug，所谓已知的 bug 就是该 commit 可能会导致项目无法运行， 或导致某些以前正常的模块失效，而这些是你开发的未完成的功能导致的。 提交时将这些地方注释掉，或者让项目先不触发它，又或者留到下个commit完成后提交。
* developer 完成该具体任务后，他/她需要发一个 PR(pull request) 以告诉其他 developer 进行 code review。
* reviewer(别的 developer) 每天需要拿出部分时间 review 他人的 PR， 发现问题就及时在 PR 里面 comment。
* developer 需要对 reviewer 的 comment 作出解释，或者提交新的 commit 去改进它。 后者你需要向 PR 里追加 commit。
* reviewer 如果对 developer 的 PR 无异议， 他会在 PR 的 comment 里面回复 +1.
* 按当前的 developer 数量来说， 子项目 omega(python code) 和 glance(JS code) 的 PR 得到2个 +1， omega-agent(go code) 的 PR 得到0个 +1，该 PR 就可以被 merge 到 master branch。
* xiaods, wtzhou, jfchen 负责相关模块的 merge 操作， PR 被 merge 后，原branch A 就会被删除。

## 集群状态约定

![cluster-status](docs/cluster-setup-rule.png)

* 创建集群，用户选择集群Master节点数，之后此配置是不可变更的。可选的配置有，1、3、5节点模式
* 集群节点数默认不超过30台。后台配置这个账户可以部署的集群节点数。
