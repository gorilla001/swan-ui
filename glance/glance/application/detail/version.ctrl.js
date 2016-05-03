/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('VersionAppCtrl', VersionAppCtrl);

    VersionAppCtrl.$inject = ['$scope', '$stateParams', 'Notification', 'confirmModal', 'appservice', 'appcurd'];

    function VersionAppCtrl($scope, $stateParams, Notification, confirmModal, appservice, appcurd) {
        var self = this;
        self.versions = [];
        self.upCanary = upCanary;

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
                getImageVersions()
            });
        };

        self.deleteVersion = function (versionId) {
            confirmModal.open('您确定要删除该版本吗？').then(function () {
                appservice.deleteAppVersion($stateParams.cluster_id, $stateParams.app_id, versionId)
                    .then(function () {
                        getImageVersions()
                    });
            });
        };

        self.setPage = function (pageNo) {
            self.currentPage = pageNo;
        };

        self.pageChanged = function () {
            self.contentCurPage = self.versions.slice((self.currentPage - 1) * self.pageLength, self.currentPage * self.pageLength);
        };

        getImageVersions();

        $scope.$on('refreshAppData', function () {
            getImageVersions(false);
        });

        function getImageVersions(loading) {
            appservice.listAppVersions({}, $stateParams.cluster_id, $stateParams.app_id, loading)
                .then(function (data) {
                        if (data && data.length !== 0) {
                            self.versions = data;
                            self.totalItems = self.versions.length;
                            self.pageLength = 10;
                            self.showPagination = (self.totalItems > self.pageLength);
                            self.contentCurPage = self.versions.slice(0, self.pageLength);
                        }
                    }
                );
        }

        function upCanary(versions) {
            appcurd.upCanary(versions)
        }
    }
})();
