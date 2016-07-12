(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoListCtrl', RepoListCtrl);


    /* @ngInject */
    function RepoListCtrl(repoBackend, utils) {
        var self = this;

        self.repositories = [];
        self.categories = [];
        self.repoImageBaseUrl = IMAGE_BASE_URL[RUNNING_ENV];
        self.OFF_LINE_IMAGE_URL = OFF_LINE_IMAGE_URL + 'app_catalog_icons/';
        self.filterCategory = filterCategory;
        self.buildFullURL = utils.buildFullURL;
        ////

        activate();

        function activate() {
            listRepository();
            listCategories();
        }

        function listRepository() {
            repoBackend.listRepositories()
                .then(function (data) {
                    self.repositories = data;
                })
        }

        function listCategories() {
            repoBackend.listCategories()
                .then(function (data) {
                    self.categories = data;
                })
        }

        function filterCategory(category) {
            return function (item){
                if(category){
                    return item.category === category
                }
                return true
            };
        }
    }
})();