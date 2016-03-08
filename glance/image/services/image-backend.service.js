(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageservice', imageservice);

    imageservice.$inject = ['gHttp'];

    function imageservice(gHttp) {
        //////
        return {
            listProjects: listProjects,
            createProject: createProject,
            deleteProject: deleteProject,
            getProject: getProject,
            updateProject: updateProject,
            listProjectImages: listProjectImages,
            listProjectApps: listProjectApps,
            buildImage: buildImage,
            deleteImage: deleteImage,
            imageLog: imageLog

        };

        function listProjects() {
            return gHttp.Resource('image.projects').get();
        }

        function createProject(data) {
            return gHttp.Resource('image.projects').post(data);
        }

        function deleteProject(projectId) {
            return gHttp.Resource('image.project', {project_id: projectId}).delete();
        }

        function getProject(projectId) {
            return gHttp.Resource('image.project', {project_id: projectId}).get();
        }

        function updateProject(projectId, data) {
            return gHttp.Resource('image.project', {project_id: projectId}).put(data);
        }

        function listProjectImages(projectId, page, itemPerPage) {
            var params = {
                page: page,
                per_page: itemPerPage
            };
            return gHttp.Resource('image.projectImages', {project_id: projectId}).get({params: params});
        }

        function listProjectApps(projectId) {
            return gHttp.Resource('image.projectApps', {project_id: projectId}).get();
        }

        function buildImage(projectId, data) {
            return gHttp.Resource('image.projectImages', {project_id: projectId}).post(data);
        }

        function deleteImage(projectId, imageId) {
            return gHttp.Resource('image.deleteImage', {project_id: projectId, image_id: imageId}).delete();
        }

        function imageLog(projectId, imageId) {
            return gHttp.Resource('image.imageLog', {project_id: projectId, image_id: imageId}).get();
        }
    }
})();