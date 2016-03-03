/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('InstanceAppCtrl', InstanceAppCtrl);

    InstanceAppCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'appservice'];

    function InstanceAppCtrl($rootScope, $scope, $stateParams, appservice) {
        var self = this;
        
        self.APP_INS_STATUS = APP_INS_STATUS;
        
        $rootScope.appTabFlag = "appInstance";
        
        initInstances();
        
        $scope.$on('refreshAppData', function() {
            initInstances();
        });

        function initInstances() {
            appservice.listAppInstances($stateParams.cluster_id, $stateParams.app_id).then(function(data){
                self.instances = data;
            }).catch(function (data) {
//                Notification.error('获取实例失败: ' + $scope.addCode[data.code]);
            });
        }
    }
})();