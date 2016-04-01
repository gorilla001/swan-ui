(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoDetailCtrl', RepoDetailCtrl);


    /* @ngInject */
    function RepoDetailCtrl($stateParams, repoBackend, $base64) {
        var self = this;
        var projectName = $stateParams.projectName;
        var repositoryName = $stateParams.repositoryName;

        self.repoDetail = {};
        self.tags = [];
        self.deploy = deploy;

        activate();

        function activate() {
            getRepoDetail(projectName, repositoryName);
            listTags(projectName, repositoryName);
        }

        function getRepoDetail(projectName, repositoryName) {
            repoBackend.getRepository(projectName, repositoryName)
                .then(function (data) {
                    self.repoDetail = data;
                    self.repoDetail.markdown = decodeURIComponent(escape($base64.decode(self.repoDetail.markdown)));
                })
        }

        function listTags(projectName, repositoryName) {
            repoBackend.listRepositoryTags(projectName, repositoryName)
                .then(function (data) {
                    self.tags = data;
                })
        }

        function deploy(){
            ///
        }

        self.fields = [
            {
                "variable": "remote_driver",
                "type": "enum",
                "required": true,
                "label": "Remote Driver",
                "description": "Remote Git and Auth scheme",
                "options": [
                    "github",
                    "bitbucket",
                    "gitlab",
                    "gogs"
                ]
            },
            {
                "variable": "remote_config",
                "type": "password",
                "required": true,
                "label": "Remote Config",
                "description": "Must be the full connection string. see http://readme.drone.io/setup/overview/ for more info"
            },
            {
                "variable": "public_port",
                "type": "int",
                "required": true,
                "label": "Public Port",
                "description": "Port that the load balancer will listen on. Must be accessible to remote driver for webhooks"
            },
            {
                "variable": "database_driver",
                "type": "enum",
                "label": "Database Driver",
                "description": "Database backend to use.",
                "required": true,
                "default": "sqlite3",
                "options": [
                    "sqlite3",
                    "postgres",
                    "mysql"
                ]
            },
            {
                "variable": "database_config",
                "label": "Database Config",
                "type": "password",
                "required": true,
                "description": "Must be full db string. The hostname for the DB will be 'database'. See http://readme.drone.io/setup/overview/ for more info"
            },
            {
                "variable": "database_service",
                "type": "service",
                "label": "Database Service",
                "description": "Service to link to for database. For instance if using the default Rancher Galera cluster select galera/galera-lb.",
                "default": "drone-server"
            }
        ];
    }
})();