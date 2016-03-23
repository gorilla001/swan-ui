/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('InstanceAppCtrl', InstanceAppCtrl);

    InstanceAppCtrl.$inject = ['$scope', '$stateParams', 'appservice'];

    function InstanceAppCtrl($scope, $stateParams, appservice) {
        var self = this;
        
        self.APP_INS_STATUS = APP_INS_STATUS;
        
        refreshInstances();
        
        $scope.$on('refreshAppData', function() {
            refreshInstances("");
        });

        function refreshInstances(loading) {
            appservice.listAppInstances($stateParams.cluster_id, $stateParams.app_id, loading).then(function(data){
                self.instances = data;
            }).catch(function (data) {
                Notification.error('获取实例失败: ' + getCodeMessage(data.code));
            });
        }
    }
})();