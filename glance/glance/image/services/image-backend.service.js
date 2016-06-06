(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageBackend', imageBackend);


    /* @ngInject */
    function imageBackend(gHttp) {
        //////
        return {
            listProjects: listProjects,
            createProject: createProject,
            deleteProject: deleteProject,
            getProject: getProject,
            updateProject: updateProject,
            listProjectImages: listProjectImages,
            getProjectImage: getProjectImage,
            listProjectApps: listProjectApps,
            buildImage: buildImage,
            deleteImage: deleteImage,
            getImageLog: getImageLog,
            manualBuild: manualBuild
        };

        function listProjects(params) {
            return gHttp.Resource('image.projects').get({params : params});
        }

        function createProject(data, form) {
            return gHttp.Resource('image.projects').post(data, {form: form});
        }

        function deleteProject(projectId) {
            return gHttp.Resource('image.project', {project_id: projectId}).delete();
        }

        function getProject(projectId, loading) {
            return gHttp.Resource('image.project', {project_id: projectId}).get({loading: loading});
        }

        function updateProject(projectId, data, form) {
            return gHttp.Resource('image.project', {project_id: projectId}).put(data, {form: form});
        }

        function listProjectImages(projectId, loading) {
            return gHttp.Resource('image.projectImages', {project_id: projectId}).get({loading: loading});
        }
        
        function getProjectImage(projectId, buildNumber) {
            return gHttp.Resource("image.projectImage", {project_id: projectId, build_num: buildNumber}).get();
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

        function getImageLog(projectId, buildNumber) {
            return gHttp.Resource('image.imageLog', {project_id: projectId, build_number: buildNumber}).get();
        }

        function manualBuild(projectId, data) {
            return gHttp.Resource('image.manualBuild', {project_id: projectId}).post(data);
        }
    }
})();