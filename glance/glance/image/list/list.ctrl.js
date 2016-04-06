(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageListCtrl', ImageListCtrl);


    /* @ngInject */
    function ImageListCtrl(imageCurd, table, data) {
        var self = this;

        self.IMAGE_STATUS = IMAGE_STATUS;
        self.projects = data.Project;
        self.imageListTable = table.createParams(data.Project, data.Count);
        
        self.goToCreateApp = goToCreateApp;
        self.manualBuild = manualBuild;
        self.deleteProject = deleteProject;
        
        function deleteProject (projectId) {
            imageCurd.deleteProjet(projectId)
        }
        
        function goToCreateApp(imageUrl) {
            imageCurd.goToCreateApp(imageUrl)
        }

        function manualBuild(project) {
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
            imageCurd.manualBuild(project.id, postData)
        }
    }
})();