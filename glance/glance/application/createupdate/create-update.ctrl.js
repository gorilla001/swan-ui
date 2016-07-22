/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('CreateAppCtrl', CreateAppCtrl);

    /* @ngInject */
    function CreateAppCtrl(appservice,
                           Notification,
                           multiSelectConfig,
                           clusterBackend,
                           appLabelService,
                           $state,
                           $scope,
                           target,
                           app,
                           $stateParams,
                           selectImageModal,
                           $filter,
                           clusterCurd) {
        var self = this;
        self.existPorts = {
            outerPorts: []
        };
        self.target = target;

        self.cluster;
        if (self.target === 'create') {
            self.form = {
                cluster_id: '',
                name: '',
                instances: 1,
                volumes: [],
                portMappings: [],
                cpus: 0.1,
                mem: 16,
                cmd: '',
                envs: [],
                imageName: $stateParams.url ? decodeURIComponent($stateParams.url) : '',
                imageVersion: $stateParams.version ? decodeURIComponent($stateParams.version) : '',
                forceImage: false,
                network: 'BRIDGE',
                constraints: [],
                logPaths: [],
                parameters: []
            };
            self.isNetworkDisable = false;
            self.isDockerArgDisable = false;
        } else {
            self.form = {
                cluster_id: app.cid,
                name: app.name,
                instances: app.instances,
                volumes: app.volumes,
                portMappings: app.ports,
                cpus: app.cpus,
                mem: app.mem,
                cmd: app.cmd,
                envs: app.envs,
                imageName: app.imageName,
                imageVersion: app.imageVersion,
                forceImage: false,
                network: app.network,
                logPaths: app.logPaths,
                parameters: app.parameters
            };
            if (!self.form.logPaths) {
                self.form.logPaths = [];
            }
            refresClusterData(app.cid, app.id).then(function () {
            });
            self.single = app.unique;
            self.isNetworkDisable = true;
        }

        self.appNames = [];
        self.clusters = [];
        self.showAdvanceContent = false;

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

        self.refresClusterData = refresClusterData;
        self.openImageModal = openImageModal;
        self.listPath = listPath;
        self.listAppPort = listAppPort;
        self.listEnvs = listEnvs;
        self.listLogPath = listLogPath;
        self.networkChange = networkChange;

        function refresClusterData(cluster_id, app_id) {
            if (!cluster_id) {
                cluster_id = self.form.cluster_id;
            }
            appservice.listAppPorts(cluster_id, app_id).then(function (data) {
                self.existPorts = data;
            });
            return clusterBackend.getCluster(cluster_id)
                .then(function (cluster) {
                    self.cluster = cluster;
                    if (cluster.group_name) {
                        self.clusterName = cluster.group_name + ":" + cluster.name;
                    } else {
                        self.clusterName = cluster.name;
                    }
                    if (cluster.is_demo_group) {
                        self.form.network = 'BRIDGE';
                        self.isNetworkDisable = true;
                        self.isDockerArgDisable = true;
                        self.form.parameters = [];
                    } else if (target === 'create') {
                        self.isNetworkDisable = false;
                        self.isDockerArgDisable = false;
                    }
                    clusterBackend.listNodes(cluster_id).then(function (data) {
                        var nodes = data.nodes;
                        self.multiSelect.labels = appLabelService.listClusterLabels(nodes);
                        self.multiSelect.nodes = [];
                        setMultiSelect(nodes, cluster.cluster_type);
                        if(self.target != 'create') {
                            setSelectNodes(app.iplist);
                        }
                    })

                });
        }

        function setMultiSelect(nodes, cluster_type) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].role != 'master' || cluster_type == '1_master') {
                    self.multiSelect.nodes.push(nodes[i]);
                }
            }

        }

        // 标签主机多选框
        self.tickItem = function (data) {
            listNodesBySelectedLabels();
        };

        self.tickAllLabels = function () {
            if (!self.form.cluster_id) {
                Notification.warning('请选择集群');
                return
            }
            angular.extend(self.multiSelect.selectedLabels, self.multiSelect.labels);
            self.multiSelect.selectedNodes = [];
            self.multiSelect.nodes = [];
            listNodesBySelectedLabels();
        };

        self.clearLabels = function () {
            self.multiSelect.selectedLabels = [];
            self.multiSelect.selectedNodes = [];
            setTick(self.multiSelect.nodes, undefined);
        };

        self.tickAllNodes = function () {
            angular.extend(self.multiSelect.selectedNodes, self.multiSelect.nodes);
            setTick(self.multiSelect.selectedNodes, true);
        };

        self.clearNode = function () {
            self.multiSelect.selectedNodes = [];
            setTick(self.multiSelect.selectedNodes, undefined);
        };

        function networkChange(host) {
            if (host === 'HOST') {
                self.disableSingle = true;
                self.single = true
            }else{
                self.disableSingle = false;
            }
        }

        // new 挂载点
        function listPath(curIndex) {
            var path = self.form.volumes.map(function (item, index) {
                if (item.containerPath && curIndex !== index) {
                    return item.containerPath
                }
            });

            return path
        }

        // new 应用地址
        function listAppPort(curIndex) {
            var appPort = self.form.portMappings.map(function (item, index) {
                if (item.mapPort && curIndex !== index) {
                    return item.mapPort
                }
            });

            if (self.existPorts.outerPorts.length && self.form.portMappings[curIndex].type == 2) {
                var concatAppPort = appPort.concat(self.existPorts.outerPorts);
                return concatAppPort
            }

            return appPort
        }

        // new 环境变量
        function listEnvs(curIndex) {
            var env = self.form.envs.map(function (item, index) {
                if (item.key && curIndex !== index) {
                    return item.key
                }
            });

            return env
        }

        //new 日志目录
        function listLogPath(curIndex) {
            var logPathArray = [];
            var length = self.form.logPaths.length;

            for (var i = 0; i < length; i++) {
                if (curIndex !== i) {
                    logPathArray.push(self.form.logPaths[i]);
                }
            }

            return logPathArray
        }

        self.addConfig = function (configName) {
            if (!self.form.cluster_id) {
                Notification.warning('没有选择集群，无法添加，请选择集群后重试');
                return
            }

            if (self.isDockerArgDisable && configName === 'parameters') {
                Notification.warning('共享集群不能添加 Docker 参数');
                return
            }
            var config = {
                volumes: {
                    hostPath: '',
                    containerPath: ''
                },
                portMappings: {
                    appPort: '',
                    protocol: 1,
                    mapPort: '',
                    type: 2,
                    isUri: 0,
                    uri: ""
                },
                envs: {
                    key: '',
                    value: ''
                },
                parameters: {
                    key: '',
                    value: ''
                },
                logPaths: ''

            };
            self.form[configName].push(config[configName]);
        };

        self.deleteConfig = function (index, configName) {
            self.form[configName].splice(index, 1);
        };

        self.createApp = function () {
            setConstraints();
            return appservice.createApp(self.form, self.form.cluster_id, $scope.staticForm)
                .then(function (data) {
                    Notification.success('应用' + self.form.name + '创建中！');
                    $state.go('app.detail.config', {cluster_id: self.form.cluster_id, app_id: data}, {reload: true});
                });
        };

        self.updateApp = function () {
            setConstraints();
            delete self.form.cluster_id;
            return appservice.updateApp(self.form, app.cid, app.id, $scope.staticForm)
                .then(function (data) {
                    $state.go('app.detail.version', {cluster_id: app.cid, app_id: app.id}, {reload: true});
                });
        };

        function listApps() {
            appservice.listApps()
                .then(function (data) {
                    angular.forEach(data.App, function (app, index) {
                        self.appNames.push(app.name);
                    });
                });
        }

        function listClusters() {
            clusterCurd.listClusterLables().then(function (data) {
                self.clusters = data
            });
        }

        function listNodesBySelectedLabels() {
            return appLabelService.listNodesByLabelIds(self.multiSelect.selectedLabels, self.form.cluster_id)
                .then(function (data) {
                    var nodes = data.nodes;
                    self.multiSelect.nodes = [];
                    self.multiSelect.selectedNodes = [];
                    angular.forEach(nodes, function (node) {
                        if (node.role != 'master' || self.cluster.cluster_type == '1_master') {
                            self.multiSelect.nodes.push(node);
                            self.multiSelect.selectedNodes.push(node);
                        }
                    });
                    setTick(self.multiSelect.selectedNodes, true);
                });
        }

        function setTick(items, value) {
            angular.forEach(items, function (item, index) {
                item.tick = value;
            });
        }

        function setConstraints() {
            var defaultEles = [];
            var hostEles = ["hostname", "UNIQUE"];
            if (self.multiSelect.selectedNodes) {
                self.form.constraints = getConstraintsByNode(self.multiSelect.selectedNodes, defaultEles, 'ip');
            } else {
                self.form.constraints = defaultEles;
            }
            if (self.single) {
                self.form.constraints.push(hostEles)
            }
        }

        function getConstraintsByNode(nodesSelect, elements, attribute) {
            if (attribute === 'ip') {
                var temp = ["ip", "LIKE"];
            } else if (attribute === 'lableName') {
                var temp = ["lable", "LIKE"];
            }

            var regular = nodesSelect.map(function (item) {
                return item[attribute]
            }).join('|');

            if (nodesSelect.length) {
                temp.push(regular);
                elements.push(temp);
            }
            return elements;
        }

        function setSelectNodes(iplist) {
            angular.forEach(self.multiSelect.nodes, function (node) {
                if (iplist.indexOf(node.ip) > -1) {
                    self.multiSelect.selectedNodes.push(node);
                }
            });
            setTick(self.multiSelect.selectedNodes, true);
        }

        function openImageModal(ev) {
            selectImageModal.open(ev).then(function (data) {
                self.form.imageName = $filter("filterVersion")(data.image, 'url');
                self.form.imageVersion = $filter("filterVersion")(data.image, 'version');
            });
        }

    }
})();