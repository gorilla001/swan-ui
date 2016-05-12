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
            //startApp: startApp,
            //deleteApp: deleteApp,
            //undoApp: undoApp,
            //updateContainer: updateContainer
        };

        function deleteStack(clusterId, stackId) {
            return confirmModal.open("是否确认删除 Stask？").then(function () {
                return layoutBackend.deleteStack(clusterId, stackId)
                    .then(function (data) {
                        return layoutBackend.list()
                    })
            });
        }

        function stopApp(clusterId, appId, stackId) {
            return appservice.stopApp(null, clusterId, appId)
                .then(function (data) {
                    return layoutBackend.getStack(clusterId, stackId)
                })
        }
    }
})();