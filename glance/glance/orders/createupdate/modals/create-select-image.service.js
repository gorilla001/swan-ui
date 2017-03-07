/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('selectImageModal', selectImageModal);

    /* @ngInject */
    function selectImageModal($mdDialog) {

        return {
            open: open
        };

        function open(ev){
            var dialog = $mdDialog.show({
                controller: SelectImageCtrl,
                controllerAs: 'selectImageCtrl',
                templateUrl: '/glance/application/createupdate/modals/create-select-image.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            });

            return dialog;
        }

        /* @ngInject */
        function SelectImageCtrl($mdDialog, imageBackend) {
            var self = this;

            self.imageList = [];
            self.image = null;
            self.datamanImages = [
                {name: '2048' , image: 'blackicebird/2048:latest', url: 'http://doc.shurenyun.com/get-started/2048.html'},
                {name: 'Mysql', image: 'index.shurenyun.com/mysql:5.6', url: 'http://doc.shurenyun.com/practice/wordpress.html'},
                {name: 'Wordpress', image: 'index.shurenyun.com/wordpress:4.4', url: 'http://doc.shurenyun.com/practice/wordpress.html'},
                {name: 'redis', image: 'index.shurenyun.com/redis:3', url: ''},
                {name: 'nginx', image: 'index.shurenyun.com/nginx:1.9', url: ''},
                {name: 'jenkins', image: 'index.shurenyun.com/centos7/mesos-0.23.0-jdk8-jenkins1.628-master:customer.v0.1', url: 'http://doc.shurenyun.com/practice/jenkins.html'},
                {name: 'haproxy', image: 'index.shurenyun.com/haproxy:1.6', url: ''}
            ];

            activate();

            self.ok = function () {
                $mdDialog.hide(self.image);
            };

            self.cancel = function () {
                $mdDialog.cancel();
            };

            function activate() {
                getImageList()
            }

            function getImageList() {
                imageBackend.listProjects()
                    .then(function (data) {
                        self.imageList = data.Project;
                    })
            }
        }
    }
})();