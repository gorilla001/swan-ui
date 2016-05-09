/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appcurd', appcurd);

    /* @ngInject */
    function appcurd(Notification, appservice, $state, confirmModal, formModal, $stateParams, upCanaryModal) {
        return {
            stop: stop,
            start: start,
            del: del,
            undo: undo,
            updateContainer: updateContainer,
            redeploy: redeploy,
            upCanary: upCanary,

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

        function del(clusterId, appId, state) {
            if (!state) {
                state = 'app.list.my';
            }
            confirmModal.open("是否确认删除应用？").then(function () {
                appservice.deleteApp(clusterId, appId)
                    .then(function (data) {
                        $state.go(state, null, {reload: true});
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
            formModal.open('/glance/application/modals/up-container.html',
                {dataName: 'instanceNum', initData: curInsNmu}).then(function (instanceNum) {
                var data = {instances: instanceNum};
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

        // 权重
        function upCanary(versions) {
            
            upCanaryModal.open(versions).then(function (versions) {
                var weight = {};
                versions.forEach(function(value) {
                    weight[value.versionId] = value.weight;
                });
                var data = {
                    "id": $stateParams.app_id,
                    "versions": weight
                };
                appservice.changeWeight($stateParams.cluster_id, $stateParams.app_id, data)
            });
        }
    }
})();