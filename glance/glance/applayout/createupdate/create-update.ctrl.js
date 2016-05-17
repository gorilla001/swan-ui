(function () {
    'use strict';
    angular.module('glance.layout')
        .controller('LayoutCreateCtrl', LayoutCreateCtrl);

    /* @ngInject */
    function LayoutCreateCtrl($scope, $state, Notification, clusterCurd, layoutBackend, target, stack, $stateParams) {
        var self = this;
        self.target = target;

        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            self.supportReadFile = true;
        } else {
            self.supportReadFile = false;
        }

        self.form = {
            name: stack.name || "",
            marathonConfig: stack.marathonConfig || STACK_DEFAULT.SryunCompose || "",
            compose: stack.compose || STACK_DEFAULT.DockerCompose || ""
        };
        self.errorInfo = {
            compose: '',
            marathonConfig: ''
        };

        self.editorOptions = {
            mode: 'yaml',
            lineNumbers: true,
            theme: 'midnight',
            matchBrackets: true
        };

        self.listClusters = listClusters;
        self.create = create;
        self.update = update;
        self.onChangeYaml = onChangeYaml;
        self.onFileSelect = onFileSelect;

        var yamlForm = {
            compose: undefined,
            marathonConfig: undefined
        };

        activate();

        function activate() {
            generateYaml('compose');
            generateYaml('marathonConfig');
            if (self.target === 'update') {
                listClusters()
                    .then(function (data) {
                        self.clusterId = stack.Cid
                    });
            }
        }

        function listClusters() {
            return clusterCurd.listClusterLables().then(function (data) {
                self.clusters = data
            });
        }

        function create() {
            layoutBackend.create(self.form, self.clusterId)
                .then(function (data) {
                    layoutBackend.deploy(self.clusterId, data.stackId)
                        .then(function (data) {
                            Notification.success('创建成功');
                            $state.go('layout.list')
                        });
                })
        }

        function update() {
            layoutBackend.update(self.form, $stateParams.cluster_id, $stateParams.stack_id)
                .then(function (data) {
                    layoutBackend.deploy(self.clusterId, data.stackId)
                        .then(function (data) {
                            Notification.success('更新成功');
                            $state.go('layout.list')
                        });
                })
        }

        function generateYaml(name) {
            try {
                yamlForm[name] = jsyaml.load(self.form[name]);
                self.errorInfo[name] = '';
                return true;
            } catch (err) {
                yamlForm[name] = undefined;
                self.errorInfo[name] = err.message;
                return false;
            }
        }

        function onChangeYaml(name) {
            var composeKeyList, marathonKeyList, diffList;
            function getDiffList(sourceList, destList) {
                var addKeyList = [],
                    delKeyList = [];
                angular.forEach(sourceList, function (composeKey, index) {
                    if(destList.indexOf(composeKey) < 0) {
                        addKeyList.push(composeKey);
                    }
                });
                angular.forEach(destList, function (composeKey, index) {
                    if(sourceList.indexOf(composeKey) < 0) {
                        delKeyList.push(composeKey);
                    }
                });

                return {
                    addKeyList: addKeyList,
                    delKeyList: delKeyList
                };
            }

            if(name === 'compose') {
                generateYaml('compose');
                if(yamlForm['compose'] && yamlForm['marathonConfig']) {
                    composeKeyList = Object.keys(yamlForm['compose']);
                    marathonKeyList = Object.keys(yamlForm['marathonConfig']);

                    diffList = getDiffList(composeKeyList, marathonKeyList);
                    angular.forEach(diffList.addKeyList, function (addKey, index) {
                        yamlForm['marathonConfig'][addKey] = {
                            cpu: 0.1,
                            mem: 168,
                            instances: 2
                        }
                    });
                    angular.forEach(diffList.delKeyList, function (delKey, index) {
                        delete yamlForm['marathonConfig'][delKey];
                    });
                    self.form.marathonConfig = jsyaml.dump(yamlForm['marathonConfig']);
                }
            } else if(name === 'marathonConfig') {
                generateYaml('marathonConfig');
                if(yamlForm['compose'] && yamlForm['marathonConfig']) {
                    composeKeyList = Object.keys(yamlForm['compose']);
                    marathonKeyList = Object.keys(yamlForm['marathonConfig']);
                    diffList = getDiffList(composeKeyList, marathonKeyList);
                    if(diffList.addKeyList.length || diffList.delKeyList.length) {
                        self.errorInfo.marathonConfig = 'docker compose和marathon compose格式不匹配';
                    }
                }
            }
        }

        function onFileSelect(type, files) {
            // files is a FileList of File objects. List some properties.
            var file = files[0];

            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    if(type == 'sry') {
                        self.form.marathonConfig = e.target.result;
                    }else if(type == 'docker') {
                        self.form.compose = e.target.result;
                    }
                    $scope.$digest();
                };
            })(file);

            reader.readAsText(file);
        }
    }
})();