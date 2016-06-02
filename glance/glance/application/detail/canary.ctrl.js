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
            self.canaryList = [
                {
                    id: 1,
                    cid: 2,
                    versionId: 1,
                    weight: 30,
                    instances: 1
                },
                {
                    id: 2,
                    cid: 2,
                    versionId: 2,
                    weight: 70,
                    instances: 2
                }
            ];

            self.canaryStatus = {
                1: {status: 2},
                2: {status: 3}
            };
            //listCanary();
            //listCanaryStatus();
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

        function upContainer(ev, instanceNum, clusterId, appId) {
            appcurd.updateContainerCanary(ev, instanceNum, clusterId, appId)
        }

        function del(clusterId, appId, versionId) {
            appcurd.deleteCanary(clusterId, appId, versionId)
        }

        function changeWeight(versions) {
            appcurd.changeWeight(versions)
        }


        $scope.$on('refreshAppData', function () {
            activate();
        });
    }
})();