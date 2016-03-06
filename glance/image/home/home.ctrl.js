(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageHomeCtrl', ImageHomeCtrl);

    ImageHomeCtrl.$inject = ['$rootScope', 'imageservice'];

    function ImageHomeCtrl($rootScope, imageservice) {
        var self = this;
        
        $rootScope.show = 'image';

        listProjets();

        self.deleteProject = function(projectId){
            ///
        };

        function listProjets(){
            imageservice.listProjects().then(function(data){
                self.projects = data;
            })
        }



    }
})();