(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageListCtrl', ImageListCtrl);


    /* @ngInject */
    function ImageListCtrl(imageCurd, $stateParams, $state, project) {
        var self = this;

        self.IMAGE_STATUS = IMAGE_STATUS;
        self.projects = project.Project;
        self.count = project.Count;

        self.query = {
            order: $stateParams.order === 'asc' ? $stateParams.sort_by : '-' + $stateParams.sort_by,
            limit: $stateParams.per_page || 20,
            page: $stateParams.page || 1
        };

        self.goToCreateApp = goToCreateApp;
        self.manualBuild = manualBuild;
        self.deleteProject = deleteProject;
        self.getPage = getPage;
        self.getOrder = getOrder;

        function deleteProject(projectId) {
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

        function getPage(page, limit) {
            console.log('getPage:', page, '||', limit);
            $state.go('imageList', {
                page: page,
                per_page: limit,
                keywords: $stateParams.keywords
            });
        }

        function getOrder(order) {
            var direction = 'asc';

            if (order.charAt(0) === '-') {
                direction = 'desc';
                order = order.slice(1);
            }

            console.log('direction',direction);
            console.log('order',order);

            $state.go('imageList', {
                page: $stateParams.page,
                per_page: $stateParams.per_page,
                order: direction,
                sort_by: order,
                keywords: $stateParams.keywords
            },{reload: true});
        }
    }
})();