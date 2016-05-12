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
        
        self.APP_INS_STATUS = APP_INS_STATUS;
        
        refreshInstances();
        
        $scope.$on('refreshAppData', function() {
            refreshInstances("");
        });

        function refreshInstances(loading) {
            appservice.listAppInstances($stateParams.cluster_id, $stateParams.app_id, loading).then(function(data){
                self.instances = data;
            });
        }
    }
})();
