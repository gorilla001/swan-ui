(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoListCtrl', RepoListCtrl);


    /* @ngInject */
    function RepoListCtrl(repoBackend, $filter) {
        var self = this;
        var repositoriesSearchTemp = [];
        var repositoriesFilterTemp = [];

        self.repositories = [];
        self.categories = [];
        self.search = search;
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
                    repositoriesSearchTemp = data;
                    repositoriesFilterTemp = data;
                })
        }

        function listCategories() {
            repoBackend.listCategories()
                .then(function (data) {
                    self.categories = data;
                })
        }

        function search(searchName) {
            self.repositories = $filter('filter')(repositoriesSearchTemp, {name: searchName})
        }

        function filterCategory(category) {
            self.searchName = '';

            if (category) {
                self.repositories = $filter('filter')(repositoriesFilterTemp, {category: category});
            } else {
                self.repositories = repositoriesFilterTemp;
            }

            repositoriesSearchTemp = self.repositories
        }
    }
})();