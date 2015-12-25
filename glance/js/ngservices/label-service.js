(function () {
    'use strict';
    angular.module('glance')
        .factory('labelService', labelService);

    labelService.$inject = ['glanceHttp', 'Notification'];

    function labelService(glanceHttp, Notification) {
        return {
            listAllLabels: listAllLabels,
            changeLabels: changeLabels,
            labelledNode: labelledNode,
            createLabel: createLabel,
            tearLabel: tearLabel,
            deleteLabel: deleteLabel
        };

        // 查询用户所有标签
        function listAllLabels() {
            return glanceHttp.ajaxGet(['cluster.label'], function(){}, undefined, function() {});
        }

        // 展开标签的操作
        function changeLabels($scope) {
            return listAllLabels()
                .then(function(resp) {
                    $scope.allLabels = resp.data.data;
                    $scope.unselectedLabels = diffLabels($scope.selectedLabels, resp.data.data);
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
            return glanceHttp.ajaxPost(['cluster.label'], {'name': $scope.labelForm.newLabelName},
                function() {}, undefined, function() {})
                .then(function(resp) {
                    labelledNode(resp.data.data, $scope);
                    $scope.allLabels = $scope.selectedLabels.concat($scope.unselectedLabels);
                    $scope.allLabelNames = $scope.getAllLabelNames($scope.allLabels, 'name');
                    
                    $scope.labelForm.label.$setPristine();
                    $scope.labelForm.newLabelName = '';
                }, function(resp) {
                    Notification.error(resp.data.errors.name);
            });
        }

        // 撕标签
        function tearLabel(label, $scope) {
            spliceLabel(label, $scope.selectedLabels);
            $scope.unselectedLabels.unshift(label);
        }

        // 删标签
        function deleteLabel(label, $scope) {
            glanceHttp.ajaxDelete(['cluster.label'], function(){}, {'labels': [label.id]}, undefined, function() {})
                .then(function() {
                    spliceLabel(label, $scope.selectedLabels);
                    spliceLabel(label, $scope.unselectedLabels);
                    $scope.allLabels = $scope.selectedLabels.concat($scope.unselectedLabels);
                    $scope.allLabelNames = $scope.getAllLabelNames($scope.allLabels, 'name');
                }, function(resp) {
                    Notification.error(resp.data.errors.labels);
                });
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