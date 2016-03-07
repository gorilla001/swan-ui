(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageHomeCtrl', ImageHomeCtrl);

    ImageHomeCtrl.$inject = ['$rootScope', 'imageservice', 'confirmModal', '$state'];

    function ImageHomeCtrl($rootScope, imageservice, confirmModal, $state) {
        var self = this;

        $rootScope.show = 'image';

        listProjets();

        self.deleteProject = function (projectId) {
            //confirmModal.open('确定删除该项目吗?').then(function () {
            //    imageservice.deleteProject(projectId).then(function (data) {
            //        $state.reload()
            //    });
            //})
        };

        function listProjets() {
            imageservice.listProjects().then(function (data) {
                self.projects = data;
            })
        }


    }
})();