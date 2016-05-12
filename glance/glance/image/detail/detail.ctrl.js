(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailCtrl', ImageDetailCtrl);


    /* @ngInject */
    function ImageDetailCtrl(project, imageCurd, $stateParams, $scope, $timeout, imageBackend, $sce) {
        var self = this;
        var refreshInterval = 20000;
        var timeoutPromise = $timeout(refreshData, refreshInterval);

        self.goToCreateApp = goToCreateApp;

        self.project = project;
        self.deleteProject = deleteProject;
        self.manualBuild = manualBuild;
        self.popoverContent = $sce.trustAsHtml('<div style="word-break: break-all">' + self.project.pubkey + '</div>');

        function deleteProject(ev) {
            imageCurd.deleteProjet($stateParams.projectId, ev)
        }

        function goToCreateApp(imageUrl){
            imageCurd.goToCreateApp(imageUrl)
        }

        function refreshData() {
            if (!self.isDestroy) {
                imageBackend.getProject($stateParams.projectId, '')
                    .then(function(data){
                        self.project = data;
                        $scope.$broadcast('refreshImageData');
                        timeoutPromise = $timeout(refreshData, refreshInterval);
                    }, function(res){
                        timeoutPromise = $timeout(refreshData, refreshInterval);
                    })
            }
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

        $scope.$on('$destroy', function () {
            self.isDestroy = true;
            $timeout.cancel(timeoutPromise);
        });
    }
})();