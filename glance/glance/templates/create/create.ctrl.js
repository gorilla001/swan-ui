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
                           $state,
                           $scope,
                           $stateParams,
                           $filter) {
        var self = this;
	
	self.form = {
		"appName": "",
		"cpus": "",
		"mem": "",
		"runAs": "nmg",
		"mode": "replicates",
		"instances": "",
		"constraints": "",
		"cmd": "",
		"args": [],
		"container": {
		    "docker": {
		        "network": "",
			"image": "",
			"forcePullImage": false,
			"privileged": true,
			"parameters": [],
			"portMappings": [],
		    }
                },
		"healthChecks": {
			"protocol": "",
			"path": "",
			"portName": "",
			"delaySeconds": "",
			"gracePeriodSeconds": "",
			"intervalSeconds": "",
			"timeoutSeconds": "",
			"consecutiveFailures": "" 
		},
		"env": {},
		"uri": [],
		"volumes": [],
		"label": {},
          }

        self.createApp = function () {
            return appservice.createApp(self.form, $scope.staticForm)
                .then(function (data) {
                    $state.go('app.list',{reload: true});
                });
        };

        self.updateApp = function () {
            setConstraints();
            setCustomRegistry();
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
        }

        function listRegistries() {
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
