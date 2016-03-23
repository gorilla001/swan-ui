/**
 * Created by my9074 on 16/3/9.
 */
(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageCurd', imageCurd);


    /* @ngInject */
    function imageCurd(imageBackend, confirmModal, Notification, $state, $filter) {
        //////
        return {
            deleteProjet: deleteProjet,
            goToCreateApp: goToCreateApp,
            manualBuild: manualBuild
        };

        function deleteProjet(projectId) {
            confirmModal.open('确定删除该项目吗?').then(function () {
                imageBackend.deleteProject(projectId).then(function (data) {
                    $state.go('imageList', null, {reload: true});
                });
            })
        }

        function goToCreateApp(imageUrl) {
            var url = $filter("filterVersion")(imageUrl, 'url');
            var version = $filter("filterVersion")(imageUrl, 'version');
            $state.go('appcreate', {url: url, version: version})
        }

        function manualBuild(projectId, project) {
            imageBackend.manualBuild(projectId, project)
                .then(function(data){
                    Notification.success('正在构建...');
                    $state.reload();
                })
        }
    }
})();