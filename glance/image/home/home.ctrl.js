(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageHomeCtrl', ImageHomeCtrl);

    ImageHomeCtrl.$inject = ['$rootScope', 'imageservice', 'imageCurd', 'ngTableParams', '$timeout', '$scope'];

    function ImageHomeCtrl($rootScope, imageservice, imageCurd, ngTableParams, $timeout, $scope) {
        var self = this;
        var listProjectPromise;
        var imageListReloadInterval = 5000;

        self.IMAGE_STATUS = IMAGE_STATUS;
        self.goToCreateApp = goToCreateApp;
        self.manualBuild = manualBuild;

        $rootScope.show = 'image';

        self.deleteProject = function (projectId) {
            imageCurd.deleteProjet(projectId)
        };

        self.imageListTable = new ngTableParams($rootScope.imageListParams, {
                counts: [20, 50, 100], // custom page count
                total: 0,
                paginationMaxBlocks: 13,
                paginationMinBlocks: 2,
                getData: function ($defer, params) {

                    $rootScope.imageListParams = self.imageListTable.parameters();

                    imageservice.listProjects(dealParams(params.url()))
                        .then(function (data) {
                            //If you remove when the current projects of only one project,
                            //set new Page and Switch back page
                            if (!data.Project.length && $rootScope.imageListParams.page > 1) {
                                $rootScope.imageListParams.page = $rootScope.imageListParams.page - 1
                            }

                            self.projects = data.Project;

                            var total = data.Count;
                            //Check whether show the warning dialog
                            if (!self.projects.length) {
                                self.showNothtingAlert = true;
                            } else {
                                self.showNothtingAlert = false;
                            }
                            params.total(total);
                            if (total > 0) {
                                $defer.resolve(data.Project);
                            }
                        }, function (res) {

                        });
                }
            }
        );

        $scope.$on('$destroy', function () {
            self.isDestroy = true;
            $timeout.cancel(listProjectPromise);
        });


        /*
         修改 ngTable 默认的 params.url() 为数人云标准格式
         */
        function dealParams(urlParams) {
            var data = {};
            for (var key in urlParams) {
                var temp = key;

                if (key === 'count') {
                    temp = 'per_page';
                }

                if (key.includes('sorting')) {
                    temp = 'order';
                    data['sort_by'] = key.slice(8, -1)
                }

                if (key === 'searchKeyWord') {
                    temp = 'keywords';
                }
                data[temp] = urlParams[key]
            }
            return data;
        }

        /*
         刷新
         */
        function reloadTable() {
            // every 5 seconds reload app list to refresh app list
            if (!self.isDestroy) {
                $timeout.cancel(listProjectPromise);

                listProjectPromise = $timeout(function () {
                    self.imageListTable.reload()
                }, imageListReloadInterval);
            }
        }

        function goToCreateApp(imageUrl) {
            imageCurd.goToCreateApp(imageUrl)
        }

        function manualBuild(project){
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
            imageCurd.manualBuild(postData)
        }
    }
})();