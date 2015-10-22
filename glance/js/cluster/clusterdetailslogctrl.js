function clusterLogsCtrl($scope, $rootScope, LogLoader) {
    $rootScope.clusterClass = "clusterLog";
    $scope.clusterlogs = new LogLoader("username", "clustername", "mesos_master_info");
}

clusterLogsCtrl.$inject = ["$scope", "$rootScope", "LogLoader"];
glanceApp.controller('clusterLogsCtrl', clusterLogsCtrl);