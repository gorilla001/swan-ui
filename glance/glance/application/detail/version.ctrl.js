/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('VersionAppCtrl', VersionAppCtrl);

    /* @ngInject */
    function VersionAppCtrl($scope, mdTable, $stateParams, Notification, confirmModal, appservice, appcurd) {
        var self = this;
        self.versions = [];
        self.cancelDeploy = function () {
            appservice.stopDeploy({}, $stateParams.cluster_id, $stateParams.app_id)
                .then(function (data) {
                    getImageVersions();
                    Notification.success('撤销成功');
                }, function (data) {
                    getImageVersions();
                });
        };

        self.verisonDeploy = function (versionId) {
            appservice.updateVersion({versionId: versionId}, $stateParams.cluster_id, $stateParams.app_id).then(function (data) {
                $scope.$emit('refreshAppStatus');
                getImageVersions();
                hasDeploymentIds();
            });
        };

        self.deleteVersion = function (versionId, ev) {
            confirmModal.open('您确定要删除该版本吗？', ev).then(function () {
                appservice.deleteAppVersion($stateParams.cluster_id, $stateParams.app_id, versionId)
                    .then(function () {
                        getImageVersions()
                    });
            });
        };

        activate();

        function activate() {
            getImageVersions();
            hasDeploymentIds();
        }

        $scope.$on('refreshAppData', function () {
            hasDeploymentIds();
            getImageVersions(false)
        });

        function getImageVersions(loading) {
            appservice.listAppVersions({}, $stateParams.cluster_id, $stateParams.app_id, loading)
                .then(function (data) {
                        if (data && data.length !== 0) {
                            self.versions = data;
                        }
                    }
                );
        }

        function hasDeploymentIds() {
            appservice.hasDeploymentIds($stateParams.cluster_id, $stateParams.app_id).then(function(data){
                self.ifCancelDeploy = data;
            })
        }
    }
})();
