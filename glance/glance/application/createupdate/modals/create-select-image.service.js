/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('selectImageModal', selectImageModal);

    selectImageModal.$inject = ['$uibModal', 'Notification'];

    function selectImageModal($uibModal, Notification) {

        SelectImageCtrl.$inject = ['$uibModalInstance', 'imageBackend', '$window'];

        return {
            open: open
        };

        function open() {
            var modalInstance = $uibModal.open({
                templateUrl: '/glance/application/createupdate/modals/create-select-image.html',
                controller: SelectImageCtrl,
                controllerAs: 'selectImageCtrl',
                size: 'lg'
            });

            return modalInstance.result;
        }


        function SelectImageCtrl($uibModalInstance, imageBackend, $window) {
            var self = this;

            self.imageList = [];
            self.image = null;
            self.datamanImages = {
                2048: {image: 'blackicebird/2048:latest', url: 'http://doc.shurenyun.com/get-started/2048.html'},
                Mysql: {
                    image: 'index.shurenyun.com/mysql:5.6',
                    url: 'http://doc.shurenyun.com/practice/wordpress.html'
                },
                Wordpress: {
                    image: 'index.shurenyun.com/wordpress:4.4',
                    url: 'http://doc.shurenyun.com/practice/wordpress.html'
                },
                redis: {image: 'index.shurenyun.com/redis:3', url: ''},
                nginx: {image: 'index.shurenyun.com/nginx:1.9', url: ''},
                jenkins: {
                    image: 'index.shurenyun.com/centos7/mesos-0.23.0-jdk8-jenkins1.628-m:customer.v0.1',
                    url: 'http://doc.shurenyun.com/practice/jenkins.html'
                },
                haproxy: {
                    image: 'index.shurenyun.com/haproxy:1.6',
                    url: ''
            }

            };

            self.selectImage = selectImage;

            activate();

            self.ok = function (image) {
                $uibModalInstance.close(image)
            };

            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
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

            function selectImage(image) {
                self.image = image;
            }
        }
    }
})();