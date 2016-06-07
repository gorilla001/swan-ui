(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailCtrl', ImageDetailCtrl);


    /* @ngInject */
    function ImageDetailCtrl(project, imageCurd, $stateParams, $scope, timing, imageBackend, $sce) {
        var self = this;

        self.goToCreateApp = goToCreateApp;

        self.project = project;
        self.deleteProject = deleteProject;
        self.manualBuild = manualBuild;
        self.popoverContent = $sce.trustAsHtml('<div style="word-break: break-all">' + self.project.pubkey + '</div>');
        
        activate();
        
        function activate() {
            timing.start($scope, refreshData, 20000);
        }

        function deleteProject(ev) {
            imageCurd.deleteProjet($stateParams.projectId, ev)
        }

        function goToCreateApp(imageUrl){
            imageCurd.goToCreateApp(imageUrl)
        }

        function refreshData() {
            return imageBackend.getProject($stateParams.projectId, '')
                .then(function(data){
                    self.project = data;
                    $scope.$broadcast('refreshImageData');
                })
        }

        function manualBuild() {
            var postData = {
                uid: project.uid,
                name: project.name,
                repoUri: project.repoUri,
                triggerType: project.triggerType,
                active: project.active,
                period: project.period,
                description: project.description,
                branch: project.branch,
                imageName: project.imageName
            };
            imageCurd.manualBuild($stateParams.projectId, postData)
        }

    }
})();