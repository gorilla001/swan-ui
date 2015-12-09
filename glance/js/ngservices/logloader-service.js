function LogLoader($filter, $rootScope, glanceHttp, $sce, Notification) {
    var LogLoader = function () {
        this.logs = [];
        this.logInfo = [];
        this.curLogNum = 0;
        this.isLoadingLogs = false;
        this.tryTimes = 3;
        this.isComplete = false;
        this.logsId = [];
        this.logSize = 0;
    };

    LogLoader.prototype.getlogs = function (callback) {
        if (this.isLoadingLogs || this.tryTimes < 0 || this.isComplete || !this.data) return;
        this.isLoadingLogs = true;
        this.data.from = this.curLogNum;

        glanceHttp.ajaxBase("post",
            ["log.search", {"userId": $rootScope.userId}],
            this.data,
            {"pretty": true},
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
                if(callback){
                    callback(this.logSize)
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

    LogLoader.prototype.searchLogs = function (searchData,callback) {
        this.logs = [];
        this.logInfo = [];
        this.logsId = [];
        this.nodeId = searchData.nodeId;
        this.gte = $filter('date')(searchData.gte,'yyyy-MM-ddTHH:mm:ss');
        this.lte = $filter('date')(searchData.lte,'yyyy-MM-ddTHH:mm:ss');
        this.clusterId = searchData.clusterId;
        this.data = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "clusterid": this.clusterId
                            }
                        },
                        {
                            "range": {
                                "timestamp": {
                                    "gte": this.gte,
                                    "lte": this.lte
                                }
                            }
                        }
                    ]
                }
            },
            "sort": {
                "timestamp": "asc"
            },
            "from": this.curLogNum,
            "size": function(){
                if(searchData.size !== undefined){
                    return searchData.size
                }else{
                    return 20
                }
            }(),
            "fields": [
                "timestamp",
                "msg",
                "ipport",
                "ip",
                "taskid"
            ],
            "highlight": {
                "require_field_match": "true",
                "fields": {
                    "msg": {
                        "pre_tags": [
                            "<em style=\"color:red;\">"
                        ],
                        "post_tags": [
                            "</em>"
                        ]
                    }
                },
                "fragment_size": -1
            }
        };

        if (searchData.logSearchKey) {
            this.query_json = {
                "match": {
                    "msg": {
                        "query": searchData.logSearchKey,
                        "analyzer": "ik"
                    }
                }
            };
            this.data.query.bool.must.push(this.query_json);
        }
        if (searchData.instanceName) {
            this.taskid_json = {
                "term": {
                    "taskid": searchData.instanceName
                }
            };
            this.data.query.bool.must.push(this.taskid_json);
        }
        if (searchData.appName) {
            this.typename_json = {
                "term": {
                    "typename": searchData.appName
                }
            };
            this.data.query.bool.must.push(this.typename_json);
        }
        if (searchData.nodeId.length) {
            this.nodeid_json = {
                "terms": {
                    "ipport": function () {
                        var nodesIp = [];
                        for (var i = 0; i < searchData.nodeId.length; i++) {
                            if(searchData.nodeId[i].hasOwnProperty('maker')){
                                nodesIp.push(searchData.nodeId[i].maker)
                            }else{
                                nodesIp.push(searchData.nodeId[i])
                            }

                        }
                        return nodesIp;
                    }(),
                    "minimum_match": 1
                }
            };
            this.data.query.bool.must.push(this.nodeid_json);
        }
        this.curLogNum = 0;
        this.isLoadingLogs = false;
        this.tryTimes = 3;
        this.isComplete = false;
        console.log(this.data)

        this.getlogs(callback);

    };

    return LogLoader;
}

LogLoader.$inject = ["$filter", "$rootScope", "glanceHttp", "$sce", "Notification"];
glanceApp.factory('LogLoader', LogLoader);
