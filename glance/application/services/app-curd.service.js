/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appcurd', appcurd);

    appcurd.$inject = ['Notification', 'appservice', '$state', 'confirmModal', 'formModal'];

    function appcurd(Notification, appservice, $state, confirmModal, formModal) {
        return {
            stop: stop,
            start: start,
            del: del,
            undo: undo,
            updateContainer: updateContainer,
            redeploy: redeploy
        };

        function stop(data, clusterId, appId) {
            appservice.stopApp(data, clusterId, appId)
                .then(function (data) {
                    $state.reload();
                })
        }

        function start(data, clusterId, appId) {
            appservice.startApp(data, clusterId, appId)
                .then(function (data) {
                    $state.reload();
                })
        }

        function del(clusterId, appId) {
            confirmModal.open("是否确认删除应用？").then(function () {
                appservice.deleteApp(clusterId, appId)
                .then(function (data) {
                    $state.go('list', null, {reload: true});
                })
            });
        }

        function undo(data, clusterId, appId) {
            appservice.stopScaling(data, clusterId, appId)
                .then(function (data) {
                    $state.reload();
                })
        }

        function updateContainer(curInsNmu, clusterId, appId) {
            formModal.open('/application/modals/up-container.html', 
                    {dataName: 'instanceNum', initData: curInsNmu}).then(function (instanceNum) {
                        var data = {instances: self.instanceNum};
                        appservice.updateContainerNum(data, clusterId, appId).then(function (data) {
                            $state.reload();
                        });
                    });
        }

        function redeploy(data, clusterId, appId) {
            appservice.reDeploy(data, clusterId, appId)
                .then(function (data) {
                    $state.reload();
                })
        }


    }
})();