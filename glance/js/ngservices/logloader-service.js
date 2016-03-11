function LogLoader($filter, $rootScope, glanceHttp, $sce, Notification, utils) {
    var LogLoader = function () {
        this.logs = [];     //logs array
        this.logInfo = [];  //logs array for data.hits.hits[i].fields
        this.curLogNum = 0;
        this.isLoadingLogs = false;
        this.tryTimes = 3;
        this.isComplete = false;
        this.logsId = [];   //id of logs array for hits.hits[i]._id
        this.logSize = 0;   //logs total
        this.downloadHref = "";
    };

    LogLoader.prototype.getlogs = function (contextCallBack) {
        var postUrl = "log.search";
        if (contextCallBack) {
            postUrl = "log.searchContext"
        }

        if (this.isLoadingLogs || this.tryTimes < 0 || this.isComplete || !this.data) return;
        this.isLoadingLogs = true;
        if (!contextCallBack) {
            this.data.from = this.curLogNum;
        }

        glanceHttp.ajaxPost(postUrl,
            this.data,
            function (data) {
                for (var i = 0; i < data.hits.hits.length; i++) {
                    var msg;
                    (data.hits.hits[i].highlight) ? msg = $sce.trustAsHtml(data.hits.hits[i].fields.ip[0] + " : " + data.hits.hits[i].highlight.msg[0]) :
                        msg = $sce.trustAsHtml(data.hits.hits[i].fields.ip[0] + " : " + data.hits.hits[i].fields.msg[0]);
                    this.logs.push(msg);
                    this.logsId.push(data.hits.hits[i]._id);
                    this.logInfo.push(data.hits.hits[i].fields);
                }

                this.isLoadingLogs = false;
                if (data.hits.hits.length == 0) {
                    this.isComplete = true;
                }
                this.logSize = data.hits.total;
                this.curLogNum += data.hits.hits.length;
                if (contextCallBack) {
                    contextCallBack(this.logSize);
                    this.enCodeUrl(this.data, contextCallBack)
                }else{
                    this.enCodeUrl(this.data)
                }
            }.bind(this),
            function (data, status) {
                if (status == 502) {
                    Notification.error("服务未激活");
                    this.tryTimes = 0;
                }
                this.isLoadingLogs = false;
                this.tryTimes--;
            }.bind(this)
        );
    };

    LogLoader.prototype.searchLogs = function (searchData, contextCallBack) {
        this.logs = [];
        this.logInfo = [];
        this.logsId = [];
        this.nodeId = searchData.nodeId;
        this.clusterId = searchData.clusterId;
        this.downloadHref= "";
        this.data = {
            "userid": parseInt($rootScope.userId),
            "clusterid": this.clusterId
        };

        if (contextCallBack) {
            this.data.timestamp = searchData.timestamp;
            this.data.ipport = searchData.ipport;
        } else {
            this.data.from = this.curLogNum;
            this.data.size = function () {
                if (searchData.size !== undefined) {
                    return searchData.size
                } else {
                    return 20
                }
            }()
        }

        if (angular.isDate(searchData.gte) && angular.isDate(searchData.lte)) {
            this.gte = $filter('date')(searchData.gte, 'yyyy-MM-ddTHH:mm:ss.sss+08:00');
            this.lte = $filter('date')(searchData.lte, 'yyyy-MM-ddTHH:mm:ss.sss+08:00');

            this.data.start = this.gte;
            this.data.end = this.lte;
        }

        if (searchData.counter) {
            this.data.counter = searchData.counter;
        }

        if (searchData.logSearchKey) {
            this.data.keyword = searchData.logSearchKey;
        }

        if (searchData.appName) {
            this.typename_json = {
                "term": {
                    "typename": searchData.appName
                }
            };
            this.data.appname = searchData.appName;
        }

        if (searchData.nodeId && searchData.nodeId.length) {
            this.ipport = function () {
                var nodesIp = [];
                for (var i = 0; i < searchData.nodeId.length; i++) {
                    if (searchData.nodeId[i].hasOwnProperty('maker')) {
                        nodesIp.push(searchData.nodeId[i].maker)
                    } else {
                        nodesIp.push(searchData.nodeId[i])
                    }

                }
                return nodesIp;
            }();
            this.data.ipport = this.ipport;
        }

        if(searchData.source){
            this.data.source = searchData.source;
        }

        this.curLogNum = 0;
        this.isLoadingLogs = false;
        this.tryTimes = 3;
        this.isComplete = false;

        this.getlogs(contextCallBack);

    };

    LogLoader.prototype.enCodeUrl = function(data, contextFlag) {
        var url = {
            userid: data.userid,
            clusterid: data.clusterid,
            keyword: data.keyword ? encodeURIComponent(data.keyword): '',
            start: data.start ? encodeURIComponent(data.start) : '',
            end: data.end ? encodeURIComponent(data.end) : '',
            source: data.source ? encodeURIComponent(data.source.join(',')): '',
            appname: data.appname ? encodeURIComponent(data.appname): '',
            counter: data.counter ? data.counter : '',
            ipport: data.ipport ? encodeURIComponent(data.ipport.join(',')) : ''
        };

        if (contextFlag) {
            this.downloadHref = utils.buildFullURL('log.downloadContext') + '?userid=' + url.userid + '&clusterid=' + url.clusterid + '&ipport=' + url.ipport + '&source=' +
                url.source + '&counter=' + url.counter + '&appname='+ url.appname;
        } else {
            this.downloadHref =  utils.buildFullURL('log.downloadSearch') + '?userid=' + url.userid + '&clusterid=' + url.clusterid + '&keyword=' + url.keyword +
                '&start=' + url.start + '&end=' + url.end + '&ipport=' + url.ipport + '&source=' +
                url.source + '&appname=' + url.appname;
        }
    };

    return LogLoader;
}

LogLoader.$inject = ["$filter", "$rootScope", "glanceHttp", "$sce", "Notification", "utils"];
glanceApp.factory('LogLoader', LogLoader);
