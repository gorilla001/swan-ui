(function () {
    'use strict';
    angular.module('glance.layout')
        .controller('LayoutCreateCtrl', LayoutCreateCtrl);

    /* @ngInject */
    function LayoutCreateCtrl($timeout, $scope, $state, Notification, clusterCurd, layoutBackend, target, stack, $stateParams) {
        var self = this;

        var yamlForm = {
            compose: '',
            marathonConfig: ''
        };
        var patt = new RegExp("^[a-z|_]+$");

        self.target = target;
        self.supportReadFile = false;
        self.refreshCodeMirror = false;

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
            matchBrackets: true,
            tabSize: 2,
            'extraKeys': {
                Tab: function (cm) {
                    var spaces = new Array(cm.getOption('indentUnit') + 1).join(' ');
                    cm.replaceSelection(spaces);
                }
            }
        };

        self.listClusters = listClusters;
        self.create = create;
        self.update = update;
        self.onChangeYaml = onChangeYaml;
        self.onFileSelect = onFileSelect;

        activate();

        function activate() {
            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                self.supportReadFile = true;
            } else {
                self.supportReadFile = false;
            }

            generateYaml('compose');
            generateYaml('marathonConfig');

            if (self.target === 'update') {
                listClusters()
                    .then(function (data) {
                        self.clusterId = stack.Cid
                    });
            }

            // cload timeout is 10, set long for it;
            var timeoutPromise = $timeout( function(){
                self.refreshCodeMirror = true;
            }, 20, false);

            $scope.$on('$destroy', function () {
                $timeout.cancel(timeoutPromise);
            });
        }

        function listClusters() {
            return clusterCurd.listClusterLables().then(function (data) {
                self.clusters = data
            });
        }

        function create() {
            layoutBackend.create(self.form, self.clusterId, $scope.createApp)
                .then(function (data) {
                    layoutBackend.deploy(self.clusterId, data.stackId)
                        .then(function (data) {
                            Notification.success('创建成功');
                            $state.go('layout.list')
                        });
                })
        }

        function update() {
            layoutBackend.update(self.form, $stateParams.cluster_id, $stateParams.stack_id, $scope.createApp)
                .then(function (data) {
                    layoutBackend.deploy(self.clusterId, data.stackId)
                        .then(function (data) {
                            Notification.success('更新成功');
                            $state.go('layout.list')
                        });
                })
        }

        function generateYaml(name) {
            var keyList;
            if(!self.form[name]) {
                yamlForm[name] = '';
                self.errorInfo[name] = '';
                return false;
            }

            if(!self.form[name].trim()) {
                yamlForm[name] = '';
                self.errorInfo[name] = '不能为空';
                return false;
            }

            try {
                yamlForm[name] = jsyaml.load(self.form[name]);
            } catch (err) {
                yamlForm[name] = '';
                self.errorInfo[name] = err.message;
                return false;
            }
            if(typeof(yamlForm[name]) === 'string') {
                yamlForm[name] = '';
                self.errorInfo[name] = '必须有多级结构';
                return false;
            }
            keyList = Object.keys(yamlForm[name]);
            for(var i=0; i < keyList.length; i++) {
                var result = patt.test(keyList[i]);
                if(!result) {
                    yamlForm[name] = '';
                    self.errorInfo[name] = '第一级只能由小写字母和下划线组成';
                    return false;
                }
            }
            self.errorInfo[name] = '';
            return true;
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