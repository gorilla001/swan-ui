/**
 * Created by my9074 on 16/3/9.
 */
(function () {
    'use strict';
    angular.module('glance.layout')
        .factory('layoutCurd', layoutCurd);


    /* @ngInject */
    function layoutCurd(layoutBackend, confirmModal, appservice) {
        //////
        return {
            deleteStack: deleteStack,
            stopApp: stopApp,
            startApp: startApp,
            deleteApp: deleteApp,
            undoApp: undoApp,
            updateContainer: updateContainer
        };

        function deleteStack(clusterId, stackId, ev) {
            return confirmModal.open("是否确认删除 Stask？", ev).then(function () {
                return layoutBackend.deleteStack(clusterId, stackId)
                    .then(function (data) {
                        return layoutBackend.list()
                    })
            });
        }

        function stopApp(data, clusterId, appId, stackId) {
            return appservice.stopApp(data, clusterId, appId)
                .then(function (data) {
                    return layoutBackend.getStack(clusterId, stackId)
                })
        }

        function startApp(data, clusterId, appId, stackId) {
            return appservice.startApp(data, clusterId, appId)
                .then(function (data) {
                    return layoutBackend.getStack(clusterId, stackId)
                })
        }

        function deleteApp(clusterId, appId, stackId, ev) {
            return confirmModal.open("是否确认删除应用？", ev).then(function () {
                return appservice.deleteApp(clusterId, appId)
                    .then(function (data) {
                        return layoutBackend.getStack(clusterId, stackId)
                    })
            });
        }

        function undoApp(data, clusterId, appId, stackId) {
            return appservice.stopScaling(data, clusterId, appId)
                .then(function (data) {
                    return layoutBackend.getStack(clusterId, stackId)
                })
        }

        function updateContainer(curInsNmu, clusterId, appId, stackId, ev) {
            return formModal.open('/glance/application/modals/up-container.html', ev,
                {dataName: 'instanceNum', initData: curInsNmu}).then(function (instanceNum) {
                var data = {instances: instanceNum};
                return appservice.updateContainerNum(data, clusterId, appId)
                    .then(function (data) {
                        return ayoutBackend.getStack(clusterId, stackId)
                    });
            });
        }
    }
})();