function clusterCtrl($scope, $state, $rootScope, glanceHttp) {
    $rootScope.show = "cluster";

    $scope.clusterNames = [];

    $scope.statName = {
        "running": "运行正常",
        "terminated": "主机失联",
        "failed": "主机预警",
        "installing": "主机初始化中"
    };

    $scope.serviceState = {};

    $scope.delCluster = function (clusterId) {
        $scope.myConfirm("您确定要删除集群吗？", function () {
            glanceHttp.ajaxGet(['cluster.delCluster', {cluster_id: clusterId}], function () {
                $state.go("cluster.listclusters", null, {reload: true});
            });
        });
    };
    
    $scope.upgradeAgent = function (clusterId) {
        glanceHttp.ajaxPost(['cluster.updateCluster'], {"id": clusterId, "isUpdateAgent": true}, function() {
            alert("设置升级成功");
        });
    }

    $scope.getClass = function(status) {
        var classes = {
            'running': 'text-success',
            'terminated': 'text-danger',
            'failed': 'text-danger',
            'installing': 'text-danger'
        };
        return classes[status];
    };

    $scope.getIsMaster = function(node) {
        return node.role === "master";
    };

    function getNodeServicesState(services, isMaster) {
        var serviceState = "running";
        var masterServiceNames = ['zookeeper', 'master', 'marathon'];
        var runningNumber = 0;
        for (var i=0; i<services.length; i++) {
            service = services[i];
            if (service.status === "installing") {
                serviceState = "installing";
                break;
            } else if (service.status == "failed") {
                if (isMaster && masterServiceNames.indexOf(service.name) > -1) {
                    serviceState = "failed";
                    break;
                } else if (!isMaster && service.name == "slave") {
                    serviceState = "failed";
                    break;
                }
            } else if (service.status == "uninstalled") {
                if (isMaster && masterServiceNames.indexOf(service.name) > -1) {
                    serviceState = "installing";
                    break;
                } else if (!isMaster && service.name == "slave") {
                    serviceState = "installing";
                    break;
                }
            }
        }
        return serviceState;
    }

    $scope.getNodeState = function(node, showStates) {
        var isMaster = $scope.getIsMaster(node);
        var servicesState = getNodeServicesState(node.services, isMaster);
        var showState;
        if (node.status === 'terminated'){
            showState = showStates[1];
        } else if(node.status === "installing" || servicesState === 'installing') {
            showState = showStates[3];
        } else if(servicesState === 'failed') {
            showState = showStates[2];
        } else {
            showState = showStates[0];
        }
        return showState;
    };

    $scope.getSeriveState = function (nodeServices) {
        for (var i = 0; i < nodeServices.length; i++) {
            if (nodeServices[i].name === "marathon") {
                $scope.serviceState.marathon = nodeServices[i].status;
            } else if (nodeServices[i].name === "master") {
                $scope.serviceState.mesos = nodeServices[i].status;
            } else if (nodeServices[i].name === "zookeeper") {
                $scope.serviceState.zookeeper = nodeServices[i].status;
            } else if (nodeServices[i].name === "slave") {
                $scope.serviceState.slave = nodeServices[i].status;
            }
        }
    };

    $scope.concatObjtoArr = function(obj) {
        var arr = [];
        $.each(obj, function(key, val) {
            arr = arr.concat(val);
        });
        return arr;
    }

    function groupMasters(nodes) {
        var cluster = {
            masters: [],
            nonMasters: []
        };
        if (nodes && nodes.length) {
            var isMaster;
            $.each(nodes, function(index, node) {
                isMaster = $scope.getIsMaster(node);
                if (isMaster) {
                    cluster.masters.push(node);
                }else{
                    cluster.nonMasters.push(node);
                }
            });
        }
        return cluster;
    }

    function classifyNodesByState(nodes, showStates) {
        var groups = {}
        var showState;
        $.each(showStates, function(index, key) {
            groups[key] = [];
        });
        if(nodes && nodes.length) {
            $.each(nodes, function(nodeIndex, node) {
                showState = $scope.getNodeState(node, showStates);
                node.showState = showState;
                groups[showState].push(node);
            });
        }
        return groups;
    }

    $scope.groupMasterWithState = function(nodes, showStates) {
        var groupsWithState = {};
        var cluster = groupMasters(nodes);
        $.each(cluster, function(key, val) {
            groupsWithState[key] = classifyNodesByState(val, showStates);
        });
        return groupsWithState;
    }

    $scope.getClusterNames = function(clusters) {
        $scope.clusterNames = [];
        if (clusters && clusters.length) {
            $.each(clusters, function(index, cluster) {
                $scope.clusterNames.push(cluster.name);
            });
        }
    }
}

clusterCtrl.$inject = ["$scope", "$state", "$rootScope", "glanceHttp"];
glanceApp.controller('clusterCtrl', clusterCtrl);
