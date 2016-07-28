
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('DebugAppCtrl', DebugAppCtrl);

    /* @ngInject*/
    function DebugAppCtrl(appservice, $stateParams) {
        var self = this;

        appservice.listAppDebug($stateParams.cluster_id, $stateParams.app_id).then(function (data) {
            self.debug = data;
        })
    }
})();