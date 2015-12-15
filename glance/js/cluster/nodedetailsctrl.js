/*global glanceApp, getNodeInfo, addMetricData*/
function nodeDetailsCtrl($rootScope, $scope, $stateParams, glanceHttp, unitConversion, buildCharts, monitor, $state, ClusterStatusMgr, labelService, Notification) {
    'use strict';
    $scope.node = {};
    $scope.showCharts = false;

    $scope.hideLabelTrash = true;
    $scope.allLabels = [];
    $scope.unselectedLabels = [];
    $scope.selectedLabels = [];

    $scope.serviceViews = [];
    $('.charts').hide();
    
    $scope.statusMgr = new ClusterStatusMgr($scope.latestVersion);
    $scope.getCurNode = function () {
        glanceHttp.ajaxGet(['cluster.nodeIns', {cluster_id: $stateParams.clusterId, node_id: $stateParams.nodeId}], function (data) {
            $scope.node = data.data;
            $scope.isMasterFlag = $scope.getIsMaster($scope.node);
            $scope.statusMgr.addNode($stateParams.clusterId, $scope.node);
            $scope.statusMgr.startListen($scope);
            
            createServiceViews();

            $scope.selectedLabels = listNodeLabels(data.data.node_labels);
        });
    };
    $scope.getCurNode();
    
    function createServiceViews() {
        if ($scope.isMasterFlag) {
            $scope.serviceViews = ["master", "marathon", "zookeeper"];
            if ($scope.node.cluster.cluster_type=='1_master') {
                $scope.serviceViews.push("slave");
            };
        } else {
            $scope.serviceViews = ["slave"];
        }
        angular.forEach($scope.node.attributes, function (attribute){
            if (attribute.attribute == "gateway") {
                $scope.serviceViews.push("bamboo_gateway");
            }
            if (attribute.attribute == "proxy") {
                $scope.serviceViews.push("bamboo_proxy");
            }
        });
    }

    $scope.DOMs = {
        cpu: 'node-cpu-chart',
        memory: 'node-memory-chart',
        disk: 'node-disk-chart'
    };

    $scope.unitConversion = unitConversion;

    $scope.getNodeMetricData = function (nodeId) {
        glanceHttp.ajaxGet(['cluster.nodeMonitor', {cluster_id: $stateParams.clusterId, node_id: nodeId}], function (data) {
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
            }
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
        var toast = '您确定要移除主机吗？';

        $scope.myConfirm(toast, function () {
            glanceHttp.ajaxDelete(['cluster.nodes', {'cluster_id': $stateParams.clusterId}], function (data) {
                $state.go('cluster.clusterdetails.nodes',{'clusterId': $stateParams.clusterId});
            }, {'ids': ids})
        });
    }
    
    $scope.resetService = function (serviceName) {
        glanceHttp.ajaxPost(['cluster.serviceStatus', {cluster_id: $stateParams.clusterId, node_id: $stateParams.nodeId, service_name: serviceName}],
                {'method': 'reset'});
    };

    $scope.changeLabels = function() {
        labelService.changeLabels($scope);
    };

    $scope.labeldNode = function(label) {
        labelService.labeldNode(label, $scope);
        confirmNodeLabel();
    };

    $scope.createLabel = function(newLabelName) {
        labelService.createLabel(newLabelName, $scope)
            .then(function() {
                confirmNodeLabel();
            });
    };

    $scope.tearLabel = function(label) {
        labelService.tearLabel(label, $scope);
        confirmNodeLabel();
    };

    $scope.deleteLabel = function(label) {
        labelService.deleteLabel(label, $scope);
        confirmNodeLabel();
    };

    function confirmNodeLabel() {
        var labelIds = $scope.getAllNodeLabelIds($scope.selectedLabels);
        var putData = {
            id: $stateParams.nodeId,
            labels: labelIds
        };

        glanceHttp.ajaxPut(['cluster.node', {'cluster_id': $stateParams.clusterId}], putData, function() {

        }, undefined, function(resp) {
            Notification.error(resp.errors.labels);
        });
    }

    function listNodeLabels(labels) {
        var nodeLabels = [];
        for (var i = 0; i < labels.length; i++) {
            nodeLabels[i] = {};
            nodeLabels[i].id = labels[i].label.id;
            nodeLabels[i].name = labels[i].label.name;
        }
        return nodeLabels;
    }

}

nodeDetailsCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'glanceHttp', 'unitConversion', 'buildCharts', 'monitor', '$state', "ClusterStatusMgr", 'labelService', 'Notification'];
glanceApp.controller('nodeDetailsCtrl', nodeDetailsCtrl);