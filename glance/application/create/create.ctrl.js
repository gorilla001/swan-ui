/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('CreateAppCtrl', CreateAppCtrl);

    CreateAppCtrl.$inject = ['appservice', 'Notification', 'multiSelectConfig', '$scope', 'clusterBackendService'];

    function CreateAppCtrl(appservice, Notification, multiSelectConfig, $scope, clusterBackendService) {
        var self = this;

        self.form = {
            cluster_id: '',
            name: '',
            instances: 0,
            volumes: [],
            portMappings: [],
            cpus: 0,
            mem: 0,
            cmd: '',
            envs: [],
            imageName: '',
            imageVersion: '',
            netWork: '',
            constraints: []
        };

        self.appNames = [];
        self.clusters = [];
        listApps();
        listClusters();

        $scope.pushVolume = function() {
            var volume = {
                hostPath: this.hostPath,
                containerPath: this.containerPath
            };
            self.form.volumes.push(volume);
        };

        self.deletVolume = function(index) {
            self.form.volumes.splice(index, 1);
        };

        self.containerConfig = {
            cpu: {
                min: 1,
                max: 10,
                options: {
                    step: 1,
                    floor: 1,
                    ceil: 10,
                    showSelectionBar: true,
                    translate: function (value) {
                        return self.form.cpus = value / 10.0;
                    }
                }
            },
            mem: {
                min: 4,
                max: 12,
                options: {
                    step: 1,
                    floor: 4,
                    ceil: 12,
                    showSelectionBar: true,
                    translate: function (value) {
                        return self.form.mem = Math.pow(2, value);
                    }
                }
            }
        };

        $scope.addPath = function () {
            var path = {
                key: this.pathKey,
                value: this.pathValue
            };
            self.form.envs.push(path);
        };

        self.deleteConfig = function (index, key) {
            self.form[key].splice(index, 1);
        };

        self.create = function () {
            if(self.constraint) {
                self.form.constraints = ['hostname', 'UNIQUE'];
            }
            
            return appservice.createApp(self.form, self.form.cluster_id)
                .then(function () {
                    Notification.success('应用' + self.form.name + '创建中！');
                }, function (resp) {
                    Notification.error('应用' + self.form.name + '创建失败' + resp.data.message)
                });
        };

        function listApps() {
            appservice.listApps()
                .then(function(data) {
                    angular.forEach(data.App, function(app, index) {
                        self.appNames.push(app.appName);
                    });
                });
        }

        function listClusters() {
            clusterBackendService.listClusters()
                .then(function(clusters) {
                    angular.forEach(clusters, function(cluster, index) {
                        self.clusters.push({id: cluster.id, name: cluster.name});
                    });
                });
        }

    }
})();