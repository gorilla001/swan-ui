/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('InstanceAppCtrl', InstanceAppCtrl);

    /* @ngInject */
    function InstanceAppCtrl($scope, mdTable, $stateParams, appservice) {
        var self = this;

        self.instances = [];
        self.table = mdTable.createTable('app.detail.instance');
        
        refreshInstances();
        
        $scope.$on('refreshAppData', function() {
            if($scope.detailAppCtrl.appStatus.status != 9  && $scope.detailAppCtrl.appStatus.status != 10){
                refreshInstances("");
            }
        });

        function refreshInstances(loading) {
            appservice.listAppInstances($stateParams.cluster_id, $stateParams.app_id, loading).then(function(data){
                self.instances = data;
            });
        }
    }
})();
