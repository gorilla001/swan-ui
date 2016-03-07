(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailCtrl', ImageDetailCtrl);

    ImageDetailCtrl.$inject = ['project', 'utils', '$state', 'imageservice', 'confirmModal'];

    function ImageDetailCtrl(project, utils, $state, imageservice, confirmModal) {
        var self = this;
        utils.clickToCopy();
        
        self.project = project;
        self.deleteProject = deleteProject;
        
        function deleteProject() {
            return imageservice.listProjectApps($state.params.projectId)
                .then(function(data) {
                    if (!data.length) {
                        $confirmModal.open('您确定要删除项目吗？')
                            .then(function() {
                                confirmDelProject();
                            });
                    } else {
                        alert('applist');
                    }
                });
        }

        function confirmDelProject() {
            return imageservice.deleteProject($state.params.projectId)
                .then(function(data) {
                    Notation.success('项目删除成功');
                    $state.go('imageHome');
                });
        };
        
    }
})();