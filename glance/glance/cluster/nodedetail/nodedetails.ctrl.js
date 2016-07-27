(function () {
    'use strict';


    angular.module('glance.cluster').controller('NodeDetailsCtrl', NodeDetailsCtrl);

    /*@ngInject*/
    function NodeDetailsCtrl($scope, $rootScope, $stateParams, unitConversion, buildCharts, monitor, $state, confirmModal, clusterBackend) {
        'use strict';
        var self = this;

        self.node = {};
        self.showPageNav = false;
        self.disablePreNav = true;
        self.disableNextNav = true;

        self.services = [];
        self.showMore = false;

        self.DOMs = {
            cpu: 'node-cpu-chart',
            memory: 'node-memory-chart',
            disk: 'node-disk-chart',
            diskio: 'node-diskio-chart',
            netio: 'node-netio-chart'
        };
        // 主机状态

        self.listNodeApps = listNodeApps;
        self.unitConversion = unitConversion;

        self.deleNode = deleNode;
        self.repairService = repairService;

        activate();
        function activate() {
            getCurNode();
            getNodeMetricData($stateParams.nodeId);
            listNodesIds();

            // 监控状态
            $scope.$on($rootScope.SUB_INFOTYPE.nodeStatus, function (event, data) {
                if ($stateParams.nodeId == data.nodeId) {
                    self.node.status = data.status;
                }
            });
            $scope.$on($rootScope.SUB_INFOTYPE.serviceStatus, function (event, data) {
                if ($stateParams.nodeId == data.nodeId) {
                    angular.forEach(self.node.services, function (val, key) {
                        if (data[val.name]) {
                            val.status = data[val.name].status;
                            val.version = data[val.name].version;
                        }
                    });
                }
            });
        }

        function getCurNode() {
            clusterBackend.getCurNode($stateParams.clusterId, $stateParams.nodeId)
                .then(function (data) {
                    self.node = data;
                    self.services = sortServices(self.node.services);
                });
        }

        // 排序
        function sortServices(data) {
            var sequence = ["docker", "master", "marathon", "zookeeper", "exhibitor", "slave", "cadvisor", "bamboo", "haproxy", "logcollection", "chronos"];
            var services = [];
            for (var i = 0; i < sequence.length; i++) {
                angular.forEach(data, function (ele) {
                    if (ele.name == sequence[i]) {
                        services.push(ele);
                    }
                });

            }
            return services;
        }

        function getNodeMetricData(nodeId) {
            clusterBackend.getNodeMetricData($stateParams.clusterId, nodeId)
                .then(function (data) {
                    setNodeInfos(data[0]);
                    var chartsData = monitor.httpMonitor.getChartsData(data);
                    buildCharts.lineCharts(chartsData, self.DOMs);

                    addMetricData(data);
                });
        }

        function addMetricData(data) {
            var nodesData, maxNodesNumber, nodeInfo, chartsData, wsTime, chartsTime;
            nodesData = data;
            $scope.$on($rootScope.SUB_INFOTYPE.nodeMetric, function (event, data) {
                if (data.nodeId == $stateParams.nodeId) {
                    maxNodesNumber = 180;

                    setNodeInfos(data);

                    nodesData.splice(0, 0, data);
                    if (nodesData.length > maxNodesNumber) {
                        nodesData.pop();
                    }
                    chartsData = monitor.httpMonitor.getChartsData(nodesData);
                    buildCharts.lineCharts(chartsData, self.DOMs);
                }
            });
        }

        function setNodeInfos(data) {
            self.node['osVersion'] = data['osVersion'] || "未知";
            self.node['agentVersion'] = data['agentVersion'] || "未知";
            self.node['memTotal'] = data['memTotal'] || "未知";
            self.node['cpuNumber'] = angular.isArray(data.cpuPercent) ? data.cpuPercent.length : "未知";
        }

        function deleNode(id, ev) {
            var ids = [];
            ids.push(id);
            var toast = '您确定要移除主机吗？';
            confirmModal.open(toast, ev).then(function () {
                clusterBackend.deleteNodes($stateParams.clusterId, ids)
                    .then(function () {
                        $state.go('cluster.detail.nodes', {'clusterId': $stateParams.clusterId});
                    });
            });
        }

        function repairService(serviceName, method) {
            if (!serviceName) {
                serviceName = self.serviceRepairInfo.serviceName;
                method = self.serviceRepairInfo.method;
            }
            clusterBackend.repairService($stateParams.clusterId, $stateParams.nodeId, serviceName, method)
        }


        // 主机导航
        function listNodesIds() {
            clusterBackend.listNodesIds($stateParams.clusterId)
                .then(function (data) {
                    var nodes = data.nodes;
                    if (nodes.length > 1) {
                        getPreAndNextNodeIds(nodes, $stateParams.nodeId);
                    }
                })
        }

        function getPreAndNextNodeIds(nodes, nodeId) {
            self.nextNodeId = $stateParams.nodeId;
            self.preNodeId = $stateParams.nodeId;

            var currentNodeIndex;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id === nodeId) {
                    currentNodeIndex = i;
                    break;
                }
            }

            if (currentNodeIndex > 0) {
                self.disablePreNav = false;
            }
            if (currentNodeIndex < nodes.length - 1) {
                self.disableNextNav = false;
            }

            if (nodes[currentNodeIndex - 1]) {
                self.preNodeId = nodes[currentNodeIndex - 1].id;
            }
            if (nodes[currentNodeIndex + 1]) {
                self.nextNodeId = nodes[currentNodeIndex + 1].id;
            }
        }

        // 主机应用
        function listNodeApps(nodeIp) {
            clusterBackend.getNodeAppList($stateParams.clusterId, nodeIp)
                .then(function (data) {
                    self.appList = data;
                });

            clusterBackend.getClusterApps($stateParams.clusterId)
                .then(function (data) {
                    self.clusterApps = data.App;
                    self.appsNameMap = {};
                    angular.forEach(self.clusterApps, function (item, index) {
                        self.appsNameMap[item.alias] = item.name;
                    });
                })
        }

    }
})();
