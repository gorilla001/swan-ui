/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('VersionAppCtrl', VersionAppCtrl);

    VersionAppCtrl.$inject = ['$scope', '$stateParams', 'Notification', 'confirmModal', 'appservice'];

    function VersionAppCtrl($scope, $stateParams, Notification, confirmModal, appservice) {
        var self = this;

        self.cancelDeploy = function () {
            appservice.stopDeploy({}, $stateParams.cluster_id, $stateParams.app_id)
                .then(function(data){
                    getImageVersions();
                    Notification.success('撤销成功');
                }, function(data) {
                    getImageVersions();
                    //Notification.error(self.addCode[data.code] + '撤销失败');
                    Notification.error('撤销失败');
                });
        };

        self.verisonDeploy = function (versionId) {
            appservice.updateVersion({versionId: versionId}, $stateParams.cluster_id, $stateParams.app_id).
                then(function(data) {
                    getImageVersions()
                }, function(data) {
                    Notification.error('部署失败: ' + getCodeMessage(data.code));
                });
        };

        self.deleteVersion = function (versionId) {
            confirmModal.open('您确定要删除该版本吗？').then(function () {
                appservice.deleteAppVersion($stateParams.cluster_id, $stateParams.app_id, versionId)
                    .then(function() {
                        getImageVersions()
                    }, function() {
                        Notification.error('删除失败: ' + getCodeMessage(data.code));
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

        $scope.$on('refreshAppData', function(){
            getImageVersions(false);
        });

        function getImageVersions(loading) {
            appservice.listAppVersions({}, $stateParams.cluster_id, $stateParams.app_id, loading)
                .then(function(data) {
                    if (data && data.length !== 0) {
                        self.versions = data;
                        self.totalItems = self.versions.length;
                        self.pageLength = 10;
                        self.showPagination = (self.totalItems > self.pageLength);
                        self.contentCurPage = self.versions.slice(0, self.pageLength);
                    }
                }, function(data) {
                    Notification.error('获取镜像列表失败: ' + getCodeMessage(data.code));
                }
            );
        };
    }
})();
