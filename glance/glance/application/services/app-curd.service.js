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
            createCanary: createCanary,
            deleteCanary: deleteCanary,
            updateContainerCanary: updateContainerCanary,
            stopCanary: stopCanary,
            startCanary: startCanary,
            changeWeight: changeWeight
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

        function updateContainer(ev, curInsNmu, clusterId, appId) {
            formModal.open('/glance/application/modals/up-container.html', ev,
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

        function createCanary(ev, formData, clusterId, appId) {
            formModal.open('/glance/application/modals/create-canary.html', ev,
                {dataName: 'form', initData: formData}).then(function (formData) {
                var data = formData;

                appservice.createCanary(data, clusterId, appId).then(function (data) {
                    $state.go('app.detail.canary', {cluster_id: clusterId, app_id: appId});
                });
            });
        }

        function deleteCanary(clusterId, appId, versionId) {
            confirmModal.open("是否确认删除该灰度版本？").then(function () {
                appservice.deleteCanary(clusterId, appId, versionId)
                    .then(function (data) {
                        $state.reload()
                    })
            });
        }

        function updateContainerCanary(ev, curInsNmu, clusterId, appId, versionId) {
            formModal.open('/glance/application/modals/up-container.html', ev,
                {dataName: 'instanceNum', initData: curInsNmu}).then(function (instanceNum) {
                var data = {instances: instanceNum};
                appservice.updateContainerCanary(data, clusterId, appId, versionId).then(function (data) {
                    $state.reload();
                });
            });
        }

        function stopCanary(data, clusterId, appId, versionId) {
            appservice.stopCanary(data, clusterId, appId, versionId)
                .then(function (data) {
                    $state.reload();
                })
        }

        function startCanary(data, clusterId, appId, versionId) {
            appservice.startCanary(data, clusterId, appId, versionId)
                .then(function (data) {
                    $state.reload();
                })
        }

        function changeWeight(ev, canaryObj) {

            upCanaryModal.open(ev, canaryObj).then(function (weights) {
                var data = {
                    id: $stateParams.app_id,
                    versions: weights
                };
                appservice.changeWeight($stateParams.cluster_id, $stateParams.app_id, data)
                    .then(function(data){
                        Notification.success('权重调整中')
                    })
            });
        }
    }
})();