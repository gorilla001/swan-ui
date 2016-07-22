(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageListCtrl', ImageListCtrl);


    /* @ngInject */
    function ImageListCtrl(imageCurd, project, mdTable, $stateParams) {
        var self = this;
        
        self.table = mdTable.createTable('image.list');
        self.projects = project.Project;
        self.count = project.Count;
        self.filter = $stateParams.keywords;


        self.goToCreateApp = goToCreateApp;
        self.manualBuild = manualBuild;
        self.deleteProject = deleteProject;

        function deleteProject(projectId, ev) {
            imageCurd.deleteProjet(projectId, ev)
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