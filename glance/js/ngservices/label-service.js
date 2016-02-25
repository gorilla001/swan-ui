(function () {
    'use strict';
    angular.module('glance')
        .factory('labelService', labelService);

    labelService.$inject = ['gHttp', 'Notification'];

    function labelService(gHttp, Notification) {
        return {
            listAllLabels: listAllLabels,
            changeLabels: changeLabels,
            labelledNode: labelledNode,
            createLabel: createLabel,
            tearLabel: tearLabel,
            deleteLabel: deleteLabel,
            formatNodeLabels: formatNodeLabels,
            listClusterLabels: listClusterLabels
        };

        // 查询用户所有标签
        function listAllLabels() {
            return gHttp.Resource('cluster.labels').get();
        }

        // 展开标签的操作
        function changeLabels($scope) {
            return listAllLabels()
                .then(function(data) {
                    $scope.allLabels = data;
                    $scope.unselectedLabels = diffLabels($scope.selectedLabels, data);
                }, function() {
                    Notification.error('服务器忙，请稍后再试。');
                });
        }

        // 给主机贴标签
        function labelledNode(label, $scope) {
            $scope.selectedLabels.push(label);
            spliceLabel(label, $scope.unselectedLabels);
        }

        // 新建标签
        function createLabel($scope) {
            return gHttp.Resource('cluster.labels').post({'name': $scope.labelForm.newLabelName}).then(function (data) {
                labelledNode(data, $scope);
                $scope.allLabels = $scope.selectedLabels.concat($scope.unselectedLabels);
                $scope.allLabelNames = $scope.getAllLabelNames($scope.allLabels, 'name');
                
                $scope.labelForm.label.$setPristine();
                $scope.labelForm.newLabelName = '';
            });
        }

        // 撕标签
        function tearLabel(label, $scope) {
            spliceLabel(label, $scope.selectedLabels);
            $scope.unselectedLabels.unshift(label);
        }

        // 删标签
        function deleteLabel(label, $scope) {
            gHttp.Resource('cluster.labels').delete({"data": [label.id]}).then(function () {
                spliceLabel(label, $scope.selectedLabels);
                spliceLabel(label, $scope.unselectedLabels);
                $scope.allLabels = $scope.selectedLabels.concat($scope.unselectedLabels);
                $scope.allLabelNames = $scope.getAllLabelNames($scope.allLabels, 'name');
            });
        }

        // 查询集群所有标签
        function listClusterLabels(clusterId) {
            return gHttp.Resource('cluster.cluster', {cluster_id: clusterId}).get();
        }

        // 格式化后端返回的集群详情接口的标签数据
        function formatNodeLabels(labels) {
            var nodeLabels = [];
            for (var i = 0; i < labels.length; i++) {
                nodeLabels[i] = {};
                nodeLabels[i].id = labels[i].label.id;
                nodeLabels[i].name = labels[i].label.name;
            }
            return nodeLabels;
        }

        function diffLabels(subtractor, minuend) {
            var newMinuend = angular.copy(minuend);
            for (var i = 0; i < subtractor.length; i++) {
                spliceLabel(subtractor[i], newMinuend);
            }
            return newMinuend;
        }

        function spliceLabel(label, labels) {
            for (var i = 0; i < labels.length; i++) {
                if (label.id === labels[i].id) {
                    labels.splice(i, 1);
                }
            }
        }
    }
})();