/*global glanceApp, getNodeInfo, addMetricData*/
function nodeDetailsCtrl($rootScope, $scope, $stateParams, gHttp, unitConversion, buildCharts, monitor, $state, ClusterStatusMgr, labelService, Notification) {
    'use strict';
    $scope.node = {};
    $scope.showCharts = false;
    $scope.showPageNav = false;
    $scope.disablePreNav = false;
    $scope.disableNextNav = false;

    $scope.allLabelNames = [];
    $scope.allLabels = [];
    $scope.unselectedLabels = [];
    $scope.selectedLabels = [];

    $scope.form = {
        newLabelName: ''
    };
    $scope.labelForm = {};

    $scope.nodeInfo = {};

    $scope.serviceViews = [];
    $('.charts').hide();

    $scope.statusMgr = new ClusterStatusMgr($scope.latestVersion);
    $scope.getCurNode = function () {
        gHttp.Resource('cluster.node', {cluster_id: $stateParams.clusterId,node_id: $stateParams.nodeId}).
            get().then(function (data) {
                $scope.node = data;
                $scope.isMasterFlag = $scope.getIsMaster($scope.node);
                $scope.statusMgr.addNode($stateParams.clusterId, $scope.node);
                $scope.statusMgr.startListen($scope);
                
                createServiceViews();
                
                $scope.selectedLabels = labelService.formatNodeLabels(data.node_labels);
            });
    };
    $scope.getCurNode();

    function createServiceViews() {
        $scope.serviceViews = ["docker"]
        if ($scope.isMasterFlag) {
            $scope.serviceViews.push("master", "marathon", "zookeeper", "exhibitor");
            if ($scope.node.cluster.cluster_type == '1_master') {
                $scope.serviceViews.push("slave", "cadvisor");
            };
        } else {
            $scope.serviceViews.push("slave", "cadvisor");
        }
        $scope.serviceViews.push("logcollection");

        angular.forEach($scope.node.attributes, function (attribute) {
            if (attribute.attribute == "gateway") {
                $scope.serviceViews.push("bamboo_gateway");
            }
            if (attribute.attribute == "proxy") {
                $scope.serviceViews.push("bamboo_proxy");
            }
        });

        if (($scope.node.cluster.master_ips && $scope.node.cluster.master_ips.indexOf($scope.node.ip) == 0 ) || $scope.statusMgr.nodes[$scope.node.id].services["chronos"].status != "uninstalled") {
            $scope.serviceViews.push("chronos");
        }
    }

    $scope.DOMs = {
        cpu: 'node-cpu-chart',
        memory: 'node-memory-chart',
        disk: 'node-disk-chart'
    };

    $scope.unitConversion = unitConversion;

    $scope.getNodeMetricData = function (nodeId) {
        gHttp.Resource('cluster.nodeMonitor', {cluster_id: $stateParams.clusterId,node_id: nodeId}).get().then(function (data) {
            setDefalutNodeInfos();

            if (data.length) {
                $scope.nodeInfo = getNodeInfo(data[0]);
            }
            $('.charts').show();
            $scope.showCharts = true;
            var chartsData = monitor.httpMonitor.getChartsData(data);
            buildCharts.lineCharts(chartsData, $scope.DOMs);

            addMetricData(data);
        });
    };

    $scope.getNodeMetricData($stateParams.nodeId);

    function addMetricData(data) {
        var nodesData, maxNodesNumber, nodeInfo, chartsData, wsTime, chartsTime;
        nodesData = data;
        $scope.$on(SUB_INFOTYPE.nodeMetric, function (event, data) {
            if (data.nodeId == $stateParams.nodeId) {
                maxNodesNumber = 180;
                if (nodesData.length) {
                    wsTime = monitor.calHourMin(data.timestamp);
                    chartsTime = monitor.calHourMin(nodesData[0].timestamp);
                    if (wsTime < chartsTime) {
                        return;
                    }
                }
                $scope.nodeInfo = getNodeInfo(data);

                nodesData.splice(0, 0, data);
                if (nodesData.length > maxNodesNumber) {
                    nodesData.pop();
                }
                chartsData = monitor.httpMonitor.getChartsData(nodesData);
                buildCharts.lineCharts(chartsData, $scope.DOMs);
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
                return $scope.nodeInfo;
            }
        }

        if (data.cpuPercent && angular.isArray(data.cpuPercent)) {
            nodeInfo.cpuNumber = data.cpuPercent.length;
        } else {
            return $scope.nodeInfo;
        }

        return nodeInfo;
    }

    function setDefalutNodeInfos() {
        var keys = ['osVersion', 'agentVersion', 'memTotal', 'cpuNumber'];
        var key;
        for (var i = 0; i < keys; i++) {
            key = keys[i];
            $scope.nodeInfo[key] = '未知';
        }
    }

    $scope.deleNode = function (id) {
        var ids = [];
        ids.push(id);
        var toast = '您确定要移除主机吗？';

        $scope.myConfirm(toast, function () {
            gHttp.Resource('cluster.nodes', {"cluster_id": $stateParams.clusterId}).delete({'data':ids}).then(function () {
                $state.go('cluster.clusterdetails.nodes', {'clusterId': $stateParams.clusterId});
            });
        });
    };

    $scope.openServiceRepair = function (serviceName) {
        $scope.serviceRepairInfo = {serviceName: serviceName, method: 'restart'};
        $('#repairService').modal("show");
    };

    $scope.repairService = function () {
        gHttp.Resource('cluster.service', {
            cluster_id: $stateParams.clusterId, node_id: $stateParams.nodeId,
            service_name: $scope.serviceRepairInfo.serviceName
        }).patch({'method': $scope.serviceRepairInfo.method});
    };

    //labels
    $scope.changeLabels = function () {
        labelService.changeLabels($scope)
            .then(function () {
                $scope.allLabelNames = $scope.getAllLabelNames($scope.allLabels, 'name');
            });

    };

    $scope.labelledNode = function (label) {
        labelService.labelledNode(label, $scope);
        confirmNodeLabel()
            .then(function () {

            }, function () {
                updateNodeLabels();
            });
    };

    $scope.createLabel = function () {
        labelService.createLabel($scope)
            .then(function () {
                confirmNodeLabel();
            });
    };

    $scope.tearLabel = function (label) {
        labelService.tearLabel(label, $scope);
        confirmNodeLabel();
    };

    $scope.deleteLabel = function (label) {
        labelService.deleteLabel(label, $scope);
    };

    function confirmNodeLabel() {
        var labelIds = $scope.getAllNodeLabelIds($scope.selectedLabels, 'id');
        var putData = {
            labels: labelIds
        };

        return gHttp.Resource('cluster.node', {'cluster_id': $stateParams.clusterId, "node_id": $stateParams.nodeId}).
            put(putData).catch(function (data) {
                Notification.error(data.data.labels);
            })
    }

    function updateNodeLabels() {
        gHttp.Resource('cluster.node', {'cluster_id': $stateParams.clusterId,'node_id': $stateParams.nodeId})
            .get().then(function (data) {
                $scope.selectedLabels = labelService.formatNodeLabels(data);
                $scope.changeLabels();
            });
    }

    // 主机导航
    (function listNodesIds() {
        gHttp.Resource('cluster.cluster', {cluster_id: $stateParams.clusterId}).get().then(function (data) {
            var nodes = data.nodes;
            if (nodes.length > 1) {
                $scope.showPageNav = true;
                getPreAndNextNodeIds(nodes, $stateParams.nodeId);
            }
        })
    })();

    $scope.goPreNode = function () {
        $state.go('cluster.nodedetails', {clusterId: $stateParams.clusterId, nodeId: $scope.preNodeId}, {reload: true});
    };

    $scope.goNextNode = function () {
        $state.go('cluster.nodedetails', {
            clusterId: $stateParams.clusterId,
            nodeId: $scope.nextNodeId
        }, {reload: true});
    };

    function getPreAndNextNodeIds(nodes, nodeId) {
        $scope.nextNodeId = $stateParams.nodeId;
        $scope.preNodeId = $stateParams.nodeId;

        var currentNodeIndex;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === nodeId) {
                currentNodeIndex = i;
                break;
            }
        }

        if (currentNodeIndex === 0) {
            $scope.disablePreNav = true;
        } else if (currentNodeIndex === nodes.length - 1) {
            $scope.disableNextNav = true;
        }

        if (nodes[currentNodeIndex - 1]) {
            $scope.preNodeId = nodes[currentNodeIndex - 1].id;
        }
        if (nodes[currentNodeIndex + 1]) {
            $scope.nextNodeId = nodes[currentNodeIndex + 1].id;
        }
    }

}

nodeDetailsCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'gHttp', 'unitConversion', 'buildCharts', 'monitor', '$state', "ClusterStatusMgr", 'labelService', 'Notification'];
glanceApp.controller('nodeDetailsCtrl', nodeDetailsCtrl);