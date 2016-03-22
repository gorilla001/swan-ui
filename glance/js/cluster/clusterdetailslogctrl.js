function clusterLogsCtrl($scope, LogLoader) {
    $scope.clusterlogs = new LogLoader("username", "clustername", "mesos_master_info");
}

clusterLogsCtrl.$inject = ["$scope", "LogLoader"];
glanceApp.controller('clusterLogsCtrl', clusterLogsCtrl);