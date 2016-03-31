(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoListCtrl', RepoListCtrl);


    /* @ngInject */
    function RepoListCtrl(repoBackend) {
        var self = this;
        self.repositories = [];
        self.categories = [];
        ////

        activate();

        function activate() {
            listRepository();
            listCategories();
        }

        function listRepository() {
            repoBackend.listRepositories()
                .then(function (data) {
                    self.repositories = data
                })
        }

        function listCategories() {
            repoBackend.listCategories()
                .then(function (data) {
                    self.categories = data;
                })
        }
    }
})();