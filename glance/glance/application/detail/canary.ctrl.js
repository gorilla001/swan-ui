/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('CanaryCtrl', CanaryCtrl);

    /* @ngInject */
    function CanaryCtrl(appservice, $stateParams, $scope, appcurd) {
        var self = this;
        self.CANARY_STATUS = APP_STATUS;
        self.canaryList = [];

        /////
        self.start = start;
        self.stop = stop;
        self.del = del;
        self.upContainer = upContainer;
        self.changeWeight = changeWeight;

        activate();

        function activate() {
            listCanary();
            listCanaryStatus();
        }

        function listCanary() {
            appservice.listCanary($stateParams.cluster_id, $stateParams.app_id)
                .then(function (data) {
                    self.canaryList = data;
                });
        }

        function listCanaryStatus() {
            appservice.listCanaryStatus($stateParams.cluster_id, $stateParams.app_id)
                .then(function (data) {
                    self.canaryStatus = data;
                });
        }

        function start(clusterId, appId, versionId) {
            var data = {};
            appcurd.startCanary(data, clusterId, appId, versionId)
        }

        function stop(clusterId, appId, versionId) {
            var data = {};
            appcurd.stopCanary(data, clusterId, appId, versionId)
        }

        function upContainer(ev, instanceNum, clusterId, appId, versionId) {
            appcurd.updateContainerCanary(ev, instanceNum, clusterId, appId, versionId)
        }

        function del(clusterId, appId, versionId) {
            appcurd.deleteCanary(clusterId, appId, versionId)
        }

        function changeWeight(ev, canaryObj) {
            appcurd.changeWeight(ev, canaryObj)
        }


        $scope.$on('refreshAppData', function () {
            activate();
        });
    }
})();