/*global glanceApp, getNodeInfo, addMetricData*/
function nodeDetailsCtrl($rootScope, $scope, $stateParams, glanceHttp, unitConversion, buildCharts, monitor, $state) {
    "use strict";
    $scope.node = {};
    $scope.showCharts = false;
    $scope.serviceViews = [];
    $('.charts').hide();
    function initStatusCache(){
        $scope.statusCache = {};
        $scope.statusCache[$stateParams.clusterId] = {"nodes": {}, "masters": {}};
        $scope.statusCache[$stateParams.clusterId].nodes[$stateParams.nodeId] = {"services": {}}
    };
    initStatusCache();
    $scope.getCurNode = function () {
        glanceHttp.ajaxGet(["cluster.nodeIns", {cluster_id: $stateParams.clusterId, node_id: $stateParams.nodeId}], function (data) {
            $scope.node = data.data;
            $scope.isMasterFlag = $scope.getIsMaster($scope.node);
            $scope.addNode2StatusStore($scope.node.cluster.id, $scope.node, $scope.statusCache);
            $scope.startListenStatusUpdate($scope, $scope.statusCache);
            
            createServiceViews();
        });
    };
    $scope.getCurNode();
    
    function createServiceViews() {
        if ($scope.isMasterFlag) {
            $scope.serviceViews = [
                 {name: "master", label: "Mesos"},
                 {name: "marathon", label: "Marathon"},
                 {name: "zookeeper", label: "Zookeeper"},
            ];
            if ($scope.node.cluster.cluster_type=='1_master') {
                $scope.serviceViews.push({name: "slave", label: "Slave"});
            };
        } else {
            $scope.serviceViews = [
                   {name: "slave", label: "Slave"},
              ];
        }
        $scope.serviceViews.push({name: "bamboo_gateway", label: "Gateway"});
        $scope.serviceViews.push({name: "bamboo_proxy", label: "Proxy"});
    }

    $scope.DOMs = {
        cpu: 'node-cpu-chart',
        memory: 'node-memory-chart',
        disk: 'node-disk-chart'
    };

    $scope.unitConversion = unitConversion;

    $scope.getNodeMetricData = function (nodeId) {
        glanceHttp.ajaxGet(["cluster.nodeMonitor", {cluster_id: $stateParams.clusterId, node_id: nodeId}], function (data) {
            if (data.data.length) {
                $scope.nodeInfo = getNodeInfo(data.data[0]);
            }
            $('.charts').show();
            $scope.showCharts = true;

            var chartsData = monitor.httpMonitor.getChartsData(data.data);
            buildCharts.lineCharts(chartsData, $scope.DOMs, 'node');
            
            addMetricData(data);
        });
    };

    $scope.getNodeMetricData($stateParams.nodeId);

    function addMetricData(data) {
        var nodesData, maxNodesNumber, nodeInfo, chartsData, wsTime, chartsTime;
        nodesData = data.data;
        $scope.$on('newNodeMetric-' + $stateParams.nodeId, function (event, data) {
            maxNodesNumber = 180;
            if (nodesData.length) {
                wsTime = monitor.calHourMin(data.timestamp);
                chartsTime = monitor.calHourMin(nodesData[0].timestamp);
                if (wsTime < chartsTime) {
                    return;
                }
            }
            nodeInfo = getNodeInfo(data);
            if (nodeInfo) {
                $scope.nodeInfo = nodeInfo;
            }

            nodesData.splice(0, 0, data);
            if (nodesData.length > maxNodesNumber) {
                nodesData.pop();
            }
            chartsData = monitor.httpMonitor.getChartsData(nodesData);
            buildCharts.lineCharts(chartsData, $scope.DOMs, 'node');
        });
    }

    function getNodeInfo(data) {
        var nodeInfo, keys, key, i;
        nodeInfo = {};
        keys = ['cpuPercent', 'osVersion', 'agentVersion', 'memTotal', 'dockerVersion'];
        for (i = 0; i < keys.length; i += 1) {
            key = keys[i];
            if (data[key]) {
                nodeInfo[key] = data[key];
            } else {
                return false;
            }
        }
        nodeInfo.cpuNumber = nodeInfo.cpuPercent.length;
        return nodeInfo;
    }

    $scope.deleNode = function(id){
        var ids = [];
        ids.push(id);
        var toast = "您确定要移除主机吗？";

        $scope.myConfirm(toast, function () {
            glanceHttp.ajaxDelete(["cluster.nodes", {"cluster_id": $stateParams.clusterId}], function (data) {
                $state.go("cluster.clusterdetails.nodes",{"clusterId": $stateParams.clusterId});
            }, {"ids": ids})
        });
    }
    
    $scope.resetService = function (serviceName) {
        glanceHttp.ajaxPost(["cluster.serviceStatus", {cluster_id: $stateParams.clusterId, node_id: $stateParams.nodeId, service_name: serviceName}],
                {"method": "reset"});
    }
}
nodeDetailsCtrl.$inject = ["$rootScope", "$scope", "$stateParams", "glanceHttp", "unitConversion", "buildCharts", "monitor", "$state"];
glanceApp.controller("nodeDetailsCtrl", nodeDetailsCtrl);
