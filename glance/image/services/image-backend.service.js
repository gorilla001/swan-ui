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
            imageLog: imageLog,
            manualBuild: manualBuild

        };

        function listProjects(params) {
            return gHttp.Resource('image.projects').get({params : params});
        }

        function createProject(data) {
            return gHttp.Resource('image.projects').post(data);
        }

        function deleteProject(projectId) {
            return gHttp.Resource('image.project', {project_id: projectId}).delete();
        }

        function getProject(projectId, loading) {
            return gHttp.Resource('image.project', {project_id: projectId}).get({loading: loading});
        }

        function updateProject(projectId, data) {
            return gHttp.Resource('image.project', {project_id: projectId}).put(data);
        }

        function listProjectImages(projectId, loading) {
            return gHttp.Resource('image.projectImages', {project_id: projectId}).get({loading: loading});
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

        function imageLog(projectId, buildNumber) {
            return gHttp.Resource('image.imageLog', {project_id: projectId, build_number: buildNumber}).get();
        }

        function manualBuild(projectId, data) {
            return gHttp.Resource('image.manualBuild', {project_id: projectId}).post(data);
        }
    }
})();