function nodeDetailsCtrl($rootScope, $scope, $stateParams, glanceHttp, unitConversion, buildCharts, monitor) {
    $scope.node = {};
    $scope.getCurNode = function () {
        var showStates = ['normal', 'disconnect', 'warning', 'reset'];
        glanceHttp.ajaxGet(["cluster.getNode", {node_id: $stateParams.nodeId}], function (data) {
            $scope.node = data.data;
            $scope.node.state = $scope.getNodeState($scope.node, showStates);
            $scope.isMasterFlag = $scope.getIsMaster($scope.node);
            $scope.getSeriveState($scope.node.services);
        });
    };
    $scope.getCurNode();

    $scope.DOMs = {
        cpu: 'node-cpu-chart',
        memory: 'node-memory-chart',
        disk: 'node-disk-chart'
    };

    $scope.unitConversion = unitConversion;

    $scope.getNodeMetricData = function (nodeId) {
        glanceHttp.ajaxGet(["cluster.getNodeMonitor", {node_id: nodeId}], function(data) {
            if(data.data.length) {
                setNodeInfos(data.data[0]);
            }
            var chartsData = monitor.httpMonitor.getChartsData(data.data);
            buildCharts.lineCharts(chartsData, $scope.DOMs, 'node');
            addMetricData(data);
        });
    };

    $scope.getNodeMetricData($stateParams.nodeId);

    function addMetricData(data) {
        var nodesData = data.data;
        $scope.$on('newNodeMetric-'+ $stateParams.nodeId, function(event, data){
            var maxNodesNumber = 180;
            if(nodesData.length) {
                var wsTime = monitor.calHourMin(data.timestamp);
                var chartsTime = monitor.calHourMin(nodesData[0].timestamp);
                if (wsTime < chartsTime) {
                    return;
                }
            } else {
                setNodeInfos(data);
            }
            nodesData.splice(0, 0, data);
            if(nodesData.length > maxNodesNumber) {
                nodesData.pop();
            }
            var chartsData = monitor.httpMonitor.getChartsData(nodesData);
            buildCharts.lineCharts(chartsData, $scope.DOMs, 'node');
        });
    }

    function setNodeInfos(data) {
        $scope.node.cpuNumber = data.cpuPercent.length;
        $scope.node.osVersion = data.osVersion;
        $scope.node.agentVersion = data.agentVersion;
        $scope.node.memTotal = data.memTotal;
        $scope.node.dockerVersion = data.dockerVersion;
    }
}

nodeDetailsCtrl.$inject = ["$rootScope", "$scope", "$stateParams", "glanceHttp", "unitConversion", "buildCharts", "monitor"];
glanceApp.controller("nodeDetailsCtrl", nodeDetailsCtrl);
