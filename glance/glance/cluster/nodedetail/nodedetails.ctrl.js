(function () {
    'use strict';


    angular.module('glance.cluster').controller('NodeDetailsCtrl', NodeDetailsCtrl);

    /*@ngInject*/
    function NodeDetailsCtrl($scope, $stateParams, unitConversion, buildCharts, monitor, $state, ClusterStatusMgr, labelService, Notification, confirmModal, clusterBackend) {
        'use strict';
        var self = this;
        self.nodeStatusCls = {
            'running': "fa fa-heartbeat text-success",
            'terminated': "fa fa-chain-broken text-danger",
            'failed': "fa fa-bomb text-danger",
            'abnormal': "fa fa-exclamation-triangle text-warning",
            'installing': "fa fa-cog text-normal",
            'initing': "fa fa-cog text-normal",
            'upgrading': "fa fa-cog text-normal",
            'repairing': "fa fa-cog text-normal"
        };


        self.node = {};
        self.showCharts = false;
        self.showPageNav = false;
        self.disablePreNav = true;
        self.disableNextNav = true;

        self.allLabelNames = [];
        self.allLabels = [];
        self.unselectedLabels = [];
        self.selectedLabels = [];

        self.form = {
            newLabelName: ''
        };
        self.labelForm = {};

        self.nodeInfo = {};
        self.services = [];
        self.showMore = false;

        self.listNodeApps = listNodeApps;

        $('.charts').hide();

        self.statusMgr = new ClusterStatusMgr();
        self.getCurNode = function () {
            clusterBackend.getCurNode($stateParams.clusterId, $stateParams.nodeId)
                .then(function (data) {
                    self.node = data;
                    $scope.isMasterFlag = $scope.getIsMaster(self.node);
                    if ($scope.isMasterFlag) {
                        self.node.role = "MASTER";
                    } else {
                        self.node.role = "SLAVE";
                    }
                    self.statusMgr.addNode($stateParams.clusterId, self.node);
                    self.statusMgr.startListen($scope);
                    createServiceViews();
                    self.selectedLabels = labelService.formatNodeLabels(data.node_labels);
                });
        };

        self.getCurNode();

        function createServiceViews() {
            var services = ["docker"];
            if ($scope.isMasterFlag) {
                services.push("master", "marathon", "zookeeper", "exhibitor");
                if (self.node.cluster.cluster_type == '1_master') {
                    services.push("slave", "cadvisor", "bamboo", "haproxy");
                }
            } else {
                services.push("slave", "cadvisor", "bamboo", "haproxy");
            }
            services.push("logcollection");
            if ((self.node.cluster.master_ips && self.node.cluster.master_ips.indexOf(self.node.ip) == 0 ) ||
                (self.statusMgr.nodes[self.node.id].services["chronos"] && self.statusMgr.nodes[self.node.id].services["chronos"].status != "uninstalled")) {
                services.push("chronos");
            }
            self.services = services;
        }

        self.DOMs = {
            cpu: 'node-cpu-chart',
            memory: 'node-memory-chart',
            disk: 'node-disk-chart',
            diskio: 'node-diskio-chart',
            netio: 'node-netio-chart'
        };

        self.unitConversion = unitConversion;

        self.getNodeMetricData = function (nodeId) {
            clusterBackend.getNodeMetricData($stateParams.clusterId, nodeId)
                .then(function (data) {
                    setDefalutNodeInfos();

                    if (data.length) {
                        self.nodeInfo = getNodeInfo(data[0]);
                    }
                    $('.charts').show();
                    self.showCharts = true;
                    var chartsData = monitor.httpMonitor.getChartsData(data);
                    buildCharts.lineCharts(chartsData, self.DOMs);

                    addMetricData(data);
                });
        };

        self.getNodeMetricData($stateParams.nodeId);

        function addMetricData(data) {
            var nodesData, maxNodesNumber, nodeInfo, chartsData, wsTime, chartsTime;
            nodesData = data;
            $scope.$on(SUB_INFOTYPE.nodeMetric, function (event, data) {
                if (data.nodeId == $stateParams.nodeId) {
                    maxNodesNumber = 180;

                    self.nodeInfo = getNodeInfo(data);

                    nodesData.splice(0, 0, data);
                    if (nodesData.length > maxNodesNumber) {
                        nodesData.pop();
                    }
                    chartsData = monitor.httpMonitor.getChartsData(nodesData);
                    buildCharts.lineCharts(chartsData, self.DOMs);
                }
            });
        }

        function getNodeInfo(data) {
            var nodeInfo = {};
            var keys = ['osVersion', 'agentVersion', 'memTotal'];

            var key;
            for (var i = 0; i < keys.length; i++) {
                key = keys[i];

                if (data[key]) {
                    nodeInfo[key] = data[key];
                } else {
                    return self.nodeInfo;
                }
            }

            if (data.cpuPercent && angular.isArray(data.cpuPercent)) {
                nodeInfo.cpuNumber = data.cpuPercent.length;
            } else {
                return self.nodeInfo;
            }

            return nodeInfo;
        }

        function setDefalutNodeInfos() {
            var keys = ['osVersion', 'agentVersion', 'memTotal', 'cpuNumber'];
            var key;
            for (var i = 0; i < keys; i++) {
                key = keys[i];
                self.nodeInfo[key] = '未知';
            }
        }


        self.deleNode = function (id, ev) {
            var ids = [];
            ids.push(id);
            var toast = '您确定要移除主机吗？';

            confirmModal.open(toast, ev).then(function () {
                clusterBackend.deleteNodes($stateParams.clusterId, ids)
                    .then(function () {
                        $state.go('cluster.detail.nodes', {'clusterId': $stateParams.clusterId});
                    });
            });
        };

        self.repairService = function (serviceName, method) {
            if (!serviceName) {
                serviceName = self.serviceRepairInfo.serviceName;
                method = self.serviceRepairInfo.method;
            }
            clusterBackend.repairService($stateParams.clusterId, $stateParams.nodeId, serviceName, method)
        };


        //labels
        self.changeLabels = function () {
            labelService.changeLabels(self)
                .then(function () {
                    self.allLabelNames = self.getAllLabelNames(self.allLabels, 'name');
                });

        };

        self.labelledNode = function (label) {
            labelService.labelledNode(label, self);
            confirmNodeLabel()
                .then(function () {

                }, function () {
                    updateNodeLabels();
                });
        };

        self.createLabel = function () {
            labelService.createLabel(self)
                .then(function () {
                    confirmNodeLabel();
                });
        };

        self.tearLabel = function (label) {
            labelService.tearLabel(label, self);
            confirmNodeLabel();
        };

        self.deleteLabel = function (label) {
            labelService.deleteLabel(label, self);
        };

        function confirmNodeLabel() {
            var labelIds = self.getAllNodeLabelIds(self.selectedLabels, 'id');
            var putData = {
                labels: labelIds
            };

            return clusterBackend.changeLables($stateParams.clusterId, $stateParams.nodeId, putData)
                .catch(function (data) {
                    Notification.error(data.data.labels);
                })
        }

        function updateNodeLabels() {
            clusterBackend.getCurNode($stateParams.clusterId, $stateParams.nodeId)
                .then(function (data) {
                    self.selectedLabels = labelService.formatNodeLabels(data);
                    self.changeLabels();
                });
        }

        // 主机导航
        (function listNodesIds() {
            clusterBackend.listNodesIds($stateParams.clusterId)
                .then(function (data) {
                    var nodes = data.nodes;
                    if (nodes.length > 1) {
                        getPreAndNextNodeIds(nodes, $stateParams.nodeId);
                    }
                })
        })();

        self.goPreNode = function () {
            $state.go('cluster.nodedetails', {
                clusterId: $stateParams.clusterId,
                nodeId: self.preNodeId
            }, {reload: true});
        };

        self.goNextNode = function () {
            $state.go('cluster.nodedetails', {
                clusterId: $stateParams.clusterId,
                nodeId: self.nextNodeId
            }, {reload: true});
        };

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