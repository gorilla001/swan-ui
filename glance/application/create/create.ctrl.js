/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('CreateAppCtrl', CreateAppCtrl);

    CreateAppCtrl.$inject = [
        'appservice', 
        'Notification', 
        'multiSelectConfig', 
        '$scope', 
        'clusterBackendService', 
        'appLabelService',
        'appModal'
    ];

    function CreateAppCtrl(
        appservice, 
        Notification, 
        multiSelectConfig, 
        $scope, 
        clusterBackendService, 
        appLabelService,
        appModal
    ) {
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
            forceImage: false,
            netWork: '',
            constraints: []
        };

        self.appNames = [];
        self.clusters = [];
        listApps();
        listClusters();

        self.multiSelect = {
            labels: [],
            selectedLabels: [],
            nodes: [],
            selectedNodes: [],
            nodesWithLabels: {},
            ip: [],
            config: {
                label: multiSelectConfig.setMultiConfig('全部选择', '清空', '恢复', '查询匹配词', '标签'),
                node: multiSelectConfig.setMultiConfig('全部选择', '清空', '恢复', '查询匹配词', '主机 (默认随机)')
            }
        };

        self.fetchClusterLabels = function() {
            clusterBackendService.listCluster(self.form.cluster_id)
                .then(function(cluster) {
                    self.multiSelect.labels = appLabelService.listClusterLabels(cluster.nodes);
                    self.multiSelect.nodes = cluster.nodes;
                });
        };

        // 标签主机多选框
        self.tickItem = function(data) {
            listNodesBySelectedLabels();
        };

        self.tickAllLabels = function() {
            angular.extend(self.multiSelect.selectedLabels, self.multiSelect.labels);
            self.multiSelect.selectedNodes = [];
            self.multiSelect.nodes = [];
            listNodesBySelectedLabels();
        };

        self.clearLabels = function() {
            self.multiSelect.selectedLabels = [];
            self.multiSelect.selectedNodes = [];
            setTick(self.multiSelect.nodes, undefined);
        };

        self.tickAllNodes = function() {
            angular.extend(self.multiSelect.selectedNodes, self.multiSelect.nodes);
            setTick(self.multiSelect.selectedNodes, true);
        };

        self.clearNode = function() {
            self.multiSelect.selectedNodes = [];
            setTick(self.multiSelect.selectedNodes, undefined);
        };

        // 挂载点
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

        // // 应用地址

        self.createApp = function () {
            if(self.constraint) {
                self.form.constraints = ['hostname', 'UNIQUE'];
            }

            var selectedNodesIps = listSelectedNodesIps();

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

        function listNodesBySelectedLabels() {
            return appLabelService.listNodesByLabelIds(self.multiSelect.selectedLabels, self.form.cluster_id)
                .then(function(nodes) {
                    self.multiSelect.nodes = nodes;
                    self.multiSelect.selectedNodes = nodes;
                    setTick(self.multiSelect.selectedNodes, true);
                });
        }

        function listSelectedNodesIps() {
            var ips = [];
            angular.forEach(self.multiSelect.selectedNodes, function(node, index) {
                ips.push(node.ip);
            });
            return ips;
        }

        function setTick(items, value) {
            angular.forEach(items, function(item, index) {
                item.tick = value;
            });
        }

    }
})();