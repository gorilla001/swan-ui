(function () {
    'use strict';
    angular.module('glance')
        .controller('iaasCtrl', iaasCtrl);


    iaasCtrl.$inject = ["$stateParams", "$scope", "gHttp"];
    function iaasCtrl($stateParams, $scope, gHttp) {

        $scope.clusterId = $stateParams.clusterId;
        $scope.refreshCode = refreshCode;

        activate();

        function activate() {
            refreshCode();
        }

        function refreshCode() {
            gHttp.Resource('cluster.nodeId', {"cluster_id": $stateParams.clusterId}).get({loading: ''})
                .then(function (res) {
                    $scope.iassCode = res.identifier;
                });
        }

    }
})();