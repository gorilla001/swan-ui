(function () {
    'use strict';
    angular.module('glance.layout')
        .controller('LayoutListCtrl', LayoutListCtrl);


    /* @ngInject */
    function LayoutListCtrl($timeout, $rootScope, $scope, data, layoutBackend, utils, clusters, layoutCurd, appservice) {
        var self = this;
        var events = undefined;

        self.clusterNameMap = listClusterMap(clusters);
        self.stacks = data.Stacks;
        self.stackTypeText = STACK_STATUS;
        self.APP_STATUS = APP_STATUS;
        self.openFlag = {};
        self.appList = {};
        self.sseMsgStatus = {};
        self.timeoutPromises = {};

        self.showTableData = showTableData;
        self.delStack = delStack;
        self.stopApp = stopApp;
        self.startApp = startApp;
        self.deleteApp = deleteApp;
        self.undoApp = undoApp;
        self.updateContainer = updateContainer;

        activate();

        $scope.$on('$destroy', function() {
            if(events) {
                events.close();
                events = undefined;
            }
        });

        function activate() {
            $scope.$on('$destroy', function () {
                for(var key in self.timeoutPromises) {
                    $timeout.cancel(self.timeoutPromises[key]);
                }
            });

            Stream(function (data) {
                for(var i=0; i < self.stacks.length; i++) {
                    var value = self.stacks[i];
                    if(value.Id === data.stackId && value.md5 !== data.md5) {
                        value.md5 = data.md5;
                        self.sseMsgStatus[data.stackId] = 'out';
                        $scope.$digest();
                        (function(value) {
                            self.timeoutPromises[data.stackId] = $timeout(function() {
                                value.status = data.status;
                                value.deploymentMessage = data.deploymentMessage;
                                self.sseMsgStatus[data.stackId] = 'in';
                                $scope.$digest();
                            }, 600, false);
                        })(value);
                        break;
                    }
                }
            });

            if(self.stacks && self.stacks.length) {
                showTableData(self.stacks[0].Cid, self.stacks[0].Id)
            }
        }

        function Stream(_callback) {
            var callback = _callback;
            var url = utils.buildFullURL("stack.sse")
                + '?authorization=' + $rootScope.token;

            events = new EventSource(url);
            events.addEventListener("deployment_process", function(event) {
                if (callback !== undefined) {
                    callback(JSON.parse(event.data));
                }
            });
            events.onerror = function (event) {
                callback = undefined;
                if (events !== undefined) {
                    events.close();
                    events = undefined;
                }
                console.log('applayout event stream closed due to error.', event);
            };
        }

        function showTableData(clusterId, stackId) {
            if (!self.openFlag[stackId]) {
                layoutBackend.getStack(clusterId, stackId).then(function (data) {
                    var applications = data.applications;
                    if(data.deployedApplications) {
                        var notExistedApps = [];
                        for(var i=0; i < data.deployedApplications.length; i++) {
                            var existed = false;
                            var deployedApp = data.deployedApplications[i];
                            for(var j=0; j < applications.length; j++) {
                                if (applications[j].Name === deployedApp.Name) {
                                    applications[j] = deployedApp;
                                    existed = true;
                                    break;
                                }
                            }
                            if(!existed) {
                                notExistedApps.push(deployedApp);
                            }
                        }
                        Array.prototype.unshift.apply(applications, notExistedApps);
                    }
                    self.appList[stackId] = applications;
                    appservice.listAppsStatus()
                        .then(function (data) {
                            self.appListStatus = data;
                        });
                    self.openFlag[stackId] = true;
                })
            } else {
                self.openFlag[stackId] = false;
                self.appList[stackId] = [];
                self.appListStatus = {}
            }
        }

        function delStack(clusterId, stackId, ev) {
            layoutCurd.deleteStack(clusterId, stackId, ev)
                .then(function (data) {
                    self.stacks = data.Stacks
                })
        }

        function stopApp(clusterId, appId, stackId) {
            var data = {};
            layoutCurd.stopApp(data, clusterId, appId, stackId)
                .then(function (data) {
                    self.appList[stackId] = data.applications;
                })
        }

        function startApp(clusterId, appId, stackId) {
            var data = {};
            layoutCurd.startApp(data, clusterId, appId, stackId)
                .then(function (data) {
                    self.appList[stackId] = data.applications;
                })
        }

        function deleteApp(clusterId, appId, stackId, ev) {
            layoutCurd.deleteApp(clusterId, appId, stackId, ev)
                .then(function (data) {
                    self.appList[stackId] = data.applications;
                })
        }

        function undoApp(clusterId, appId, stackId) {
            var data = {};
            layoutCurd.undoApp(data, clusterId, appId, stackId)
                .then(function (data) {
                    self.appList[stackId] = data.applications;
                })
        }

        function updateContainer(curInsNmu, clusterId, appId, stackId, ev) {
            layoutCurd.updateContainer(curInsNmu, clusterId, appId, stackId, ev)
                .then(function (data) {
                    self.appList[stackId] = data.applications;
                })
        }

        /*
         获取集群名
         */
        function listClusterMap(clusters) {
            var clusterNameMap = {};
            angular.forEach(clusters, function (cluster) {
                clusterNameMap[cluster.id] = cluster.name;
            });
            return clusterNameMap
        }

        ///
    }
})();
