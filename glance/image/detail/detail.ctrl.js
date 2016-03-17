(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailCtrl', ImageDetailCtrl);

    ImageDetailCtrl.$inject = ['project', 'imageCurd', '$stateParams', '$scope', '$timeout', 'imageservice'];

    function ImageDetailCtrl(project, imageCurd, $stateParams, $scope, $timeout, imageservice) {
        var self = this;
        var refreshInterval = 20000;
        var timeoutPromise = $timeout(refreshData, refreshInterval);

        self.goToCreateApp = goToCreateApp;

        self.project = project;
        self.deleteProject = deleteProject;

        function deleteProject() {
            imageCurd.deleteProjet($stateParams.projectId)
        }

        function goToCreateApp(imageUrl){
            imageCurd.goToCreateApp(imageUrl)
        }

        function refreshData() {
            if (!self.isDestroy) {
                imageservice.getProject($stateParams.projectId, '')
                    .then(function(data){
                        self.project = data;
                        $scope.$broadcast('refreshImageData');
                        timeoutPromise = $timeout(refreshData, refreshInterval);
                    }, function(res){
                        timeoutPromise = $timeout(refreshData, refreshInterval);
                    })
            }
        }

        $scope.$on('$destroy', function () {
            self.isDestroy = true;
            $timeout.cancel(timeoutPromise);
        });
    }
})();