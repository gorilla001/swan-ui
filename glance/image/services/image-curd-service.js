/**
 * Created by my9074 on 16/3/9.
 */
(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageCurd', imageCurd);

    imageCurd.$inject = ['imageservice', 'confirmModal', 'Notification', '$state', '$filter'];

    function imageCurd(imageservice, confirmModal, Notification, $state, $filter) {
        //////
        return {
            deleteProjet: deleteProjet,
            goToCreateApp: goToCreateApp
        };

        function deleteProjet(projectId) {
            confirmModal.open('确定删除该项目吗?').then(function () {
                imageservice.deleteProject(projectId).then(function (data) {
                    $state.go('imageHome', null, {reload: true});
                }, function (res) {
                    Notification.error('删除失败');
                });
            })
        }

        function goToCreateApp(imageUrl) {
            var url = $filter("filterVersion")(imageUrl, 'url');
            var version = $filter("filterVersion")(imageUrl, 'version');
            $state.go('appcreate', {url: url, version: version})
        }
    }
})();