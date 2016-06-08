(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoListCtrl', RepoListCtrl);


    /* @ngInject */
    function RepoListCtrl(repoBackend) {
        var self = this;

        self.repositories = [];
        self.categories = [];
        self.repoImageBaseUrl = IMAGE_BASE_URL[RUNNING_ENV] + 'app_catalog_icons/';
        self.OFFLINE_IMEGA_URL = OFFLINE_IMEGA_URL + 'app_catalog_icons/';
        self.filterCategory = filterCategory;
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