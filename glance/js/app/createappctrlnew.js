glanceApp.controller("createappCtrlNew", createappCtrl);

createappCtrl.$inject = ['$scope', '$state', 'glanceHttp', 'Notification', '$uibModal', 'getClusterLables'];

function createappCtrl($scope, $state, glanceHttp, Notification, $uibModal, getClusterLables) {
    var INNER = '1';
    var OUTER = '2';
    var SELECT_TCP = '1';
    var SELECT_HTTP = '2';
    var HAS_DOMAIN = '1';
    var NO_DOMAIN = '2';

    var HOST_MODEL = 'HOST';
    var BRIDGE_MODEL = 'BRIDGE';

    //defalut select Node Type is 'node'
    $scope.selectNodeType = 'node';
    $scope.creatAppLableList = [];
    $scope.appLableList = [];
    $scope.selectLabelIdList = [];

    $scope.ajaxParams = {
        labels:[]
    }

    $scope.portInfo = {};
    $scope.portInfos = [];

    $scope.pathInfo = {};
    $scope.pathsInfo = [];

    $scope.outerPorts = [];
    $scope.innerPorts = [];
    $scope.domains = [];

    $scope.dirInfo = {
        hostPath: "",
        containerPath: ""
    };
    $scope.dirsInfo = [];

    $scope.cpuSize = 0.1;
    $scope.memSize = 16;
    $scope.containerNum = 1;
    $scope.imageversion = "";

    $scope.cpuSlider = {
        min: 1,
        max: 10,
        options: {
            step: 1,
            floor: 1,
            ceil: 10,
            showSelectionBar: true,
            translate: function (value) {
                return $scope.cpuSize = value / 10.0;
            }
        }
    };

    $scope.memSlider = {
        min: 4,
        max: 12,
        options: {
            step: 1,
            floor: 4,
            ceil: 12,
            showSelectionBar: true,
            translate: function (rawValue) {
                return $scope.memSize = Math.pow(2, rawValue);
            }
        }
    };

    $scope.deployinfo = {
        network: "BRIDGE"    //defalut network for radio box
    };

    $scope.nodeMultiConfig = {
        selectAll: "全部选择",
        selectNone: "清空",
        reset: "恢复",
        search: "查询匹配词",
        nothingSelected: "主机 (默认随机)"
    };
    $scope.lableMultiConfig = {
        selectAll: "全部选择",
        selectNone: "清空",
        reset: "恢复",
        search: "查询匹配词",
        nothingSelected: "标签"
    };

    $scope.defaultEles = [];    //defalut constraints
    $scope.hostEles = ["hostname", "UNIQUE"];

    $scope.deployApp = function () {
        if ($scope.portInfos.length) {
            $scope.deployinfo.containerPortsInfo = $scope.portInfos;
        } else {
            delete $scope.deployinfo.containerPortsInfo;
        }

        if ($scope.pathsInfo.length) {
            $scope.deployinfo.envs = $scope.pathsInfo;
        } else {
            delete $scope.deployinfo.envs;
        }

        if ($scope.cmdInput) {
            $scope.deployinfo.cmd = $scope.cmdInput;
        } else {
            delete $scope.deployinfo.cmd;
        }

        //add dirsInfo
        if ($scope.dirsInfo.length) {
            $scope.deployinfo.containerVolumesInfo = $scope.dirsInfo;
        } else {
            delete $scope.deployinfo.containerVolumesInfo;
        }

        //Constraints of node
        if ($scope.selectNodes.length) {
            $scope.makeConstraints($scope.selectNodes, $scope.defaultEles, 'ip');
        } else {
            $scope.deployinfo.constraints = $scope.defaultEles;
        }
        //Constraints if checked HOST and checked single
        if ($scope.single) {
            $scope.deployinfo.constraints.push($scope.hostEles)
        }


        $scope.deployinfo.clusterId = $scope.clusterid.toString();
        $scope.deployinfo.containerNum = $scope.containerNum.toString();
        $scope.deployinfo.containerCpuSize = $scope.cpuSize;
        $scope.deployinfo.containerMemSize = $scope.memSize;
        $scope.deployinfo.imageversion = $scope.imageversion;
        glanceHttp.ajaxPost(['app.deploy'], $scope.deployinfo, function (data) {
            Notification.success('应用' + $scope.deployinfo.appName + '创建中...');
            $state.go('app.appdetail.config', {appId: data.data}, {reload: true});
        }, undefined, null, function (data) {
            Notification.error('应用' + $scope.deployinfo.appName + '创建失败: ' + $scope.addCode[data.code]);
        });
    };

    $scope.deletCurPort = function (index) {
        $scope.portInfos.splice(index, 1);
    };

    $scope.addPortInfo = function (portInfo) {
        if (isDisableAddList(portInfo, $scope.portInfos, ['type', 'mapPort', 'uri'])) {
            Notification.error('添加的应用地址已存在');
        } else {
            $scope.portInfos.push(portInfo);
            $scope.portInfo = {};
        }
    };

    /*
     Check whether the port is being used
     */
    $scope.portOccupied = function (portInfo) {
        if (portInfo.type === OUTER && portInfo.isUri != HAS_DOMAIN && $scope.outerPorts.indexOf(portInfo.mapPort) != -1) {
            return true
        } else if (portInfo.type === INNER && $scope.innerPorts.indexOf(portInfo.mapPort) != -1) {
            return true
        } else {
            return false
        }
    };

    /*
     Check whether the URI is being used
     */
    $scope.uriOccupied = function (portInfo) {
        return $scope.domains.indexOf(portInfo.uri) != -1
    };

    $scope.addPathInfo = function (pathInfo) {
        if (isDisableAddList(pathInfo, $scope.pathsInfo, ['key'])) {
            Notification.error('添加的环境变量的 KEY 不能重复');
        } else {
            $scope.pathsInfo.push(pathInfo);
            $scope.pathInfo = {};
        }
    };

    $scope.addDirInfo = function (dirInfo) {
        if (isDisableAddList(dirInfo, $scope.dirsInfo, ['containerPath'])) {
            Notification.error('无法映射主机的多个目录到同一个容器目录');
        } else {
            $scope.dirsInfo.push(dirInfo);
            $scope.dirInfo = {};
        }
    };

    function isDisableAddList(info, infoArray, attrnames) {
        function equal(info1, info2) {
            for (var i = 0; i < attrnames.length; i++) {
                if (info1[attrnames[i]] != info2[attrnames[i]]) {
                    return false;
                }
            }
            return true;
        }

        for (var i = 0; i < infoArray.length; i++) {
            if (equal(info, infoArray[i])) {
                return true;
            }
        }
        return false;
    }

    $scope.deletCurDir = function (index) {
        $scope.dirsInfo.splice(index, 1);
    };

    $scope.deletCurPath = function (index) {
        $scope.pathsInfo.splice(index, 1);
    };

    $scope.changeType = function (portInfoType) {
        $scope.portInfo.uri = "";
        if (portInfoType === OUTER && $scope.portInfo.protocol === SELECT_HTTP) {
            $scope.portInfo.isUri = HAS_DOMAIN;
            $scope.portInfo.mapPort = 80;
        } else {
            $scope.portInfo.mapPort = "";
            if ($scope.portInfo.hasOwnProperty('uri')) {
                delete $scope.portInfo.uri
            }
            if ($scope.portInfo.hasOwnProperty('isUri')) {
                delete $scope.portInfo.isUri;
            }
        }
    };

    $scope.changeProtocol = function () {
        if ($scope.portInfo.protocol === SELECT_HTTP && $scope.portInfo.type === OUTER) {
            $scope.portInfo.isUri = HAS_DOMAIN;
            $scope.portInfo.mapPort = 80;
        }

        if ($scope.portInfo.protocol === SELECT_TCP) {
            if ($scope.portInfo.hasOwnProperty('uri')) {
                delete $scope.portInfo.uri
            }
            if ($scope.portInfo.hasOwnProperty('isUri')) {
                delete $scope.portInfo.isUri;
            }
        }
    };

    $scope.isURI = function (isUri) {
        if (isUri === HAS_DOMAIN) {
            $scope.portInfo.mapPort = 80;
        } else if (isUri === NO_DOMAIN) {
            $scope.portInfo.mapPort = "";
            if ($scope.portInfo.hasOwnProperty('uri')) {
                delete $scope.portInfo.uri
            }
        }
    };

    $scope.isAddPortDisable = function (portInfo) {
        if (!portInfo.appPort || !portInfo.protocol || !portInfo.type || portInfo.protocol === '' || portInfo.type === '') {
            return true;
        }

        if ((portInfo.type === OUTER && portInfo.isUri != HAS_DOMAIN && $scope.gateWays.length == 0) || (portInfo.type === INNER && $scope.proxyNodes.length == 0)) {
            return true;
        }

        if (portInfo.type === INNER && portInfo.mapPort) {
            return false;
        } else if (portInfo.type === OUTER && portInfo.isUri === HAS_DOMAIN && portInfo.uri) {
            return false
        } else if (portInfo.type === OUTER && portInfo.isUri === NO_DOMAIN && portInfo.mapPort) {
            return false;
        } else if (portInfo.protocol === SELECT_TCP && (portInfo.type && portInfo.type !== '') && portInfo.mapPort) {
            return false;
        } else {
            return true;
        }
    };

    $scope.isAddPathDisable = function (pathInfo) {
        if (!pathInfo.key || !pathInfo.value || pathInfo.key === '' || pathInfo.value === '') {
            return true;
        }
    };

    $scope.getChangeData = function (clusterId) {
        //empty ajaxParams.labels
        $scope.ajaxParams.labels = []

        $scope.getNode(clusterId);
        $scope.appLableList = $scope.creatAppNodeList.map(function(item) {
            item.ticked = false;
            return item;
        });
        //get lable List of cluster
        getClusterLables.listClusterLabels(clusterId, $scope);
        glanceHttp.ajaxGet(['app.ports', ({cluster_id: clusterId})], function (data) {
            if (data.data) {
                if (data.data.OuterPorts && data.data.OuterPorts.length) {
                    $scope.outerPorts = data.data.OuterPorts;
                }

                if (data.data.InnerPorts && data.data.InnerPorts.length) {
                    $scope.innerPorts = data.data.InnerPorts;
                }

                if (data.data.Domains && data.data.Domains.length) {
                    $scope.domains = data.data.Domains;
                }
            }
        })
    };

    var promise = $scope.getAppName();
    promise.then($scope.listCluster);

    // createPortModule
    $scope.openPortModule = function (size) {

        var modalInstance = $uibModal.open({
            templateUrl: '../../views/app/createPortModule.html',
            controller: 'ModalPortCtrl',
            size: size,
            scope: $scope,
            backdrop: 'static'
        });

        modalInstance.result.then(function () {
            $scope.portInfo = {};
        }, function () {
            $scope.portInfo = {};
        });
    };

    // createPathModule
    $scope.openPathModule = function (size) {

        var modalInstance = $uibModal.open({
            templateUrl: '../../views/app/createPathModule.html',
            controller: 'ModalPathCtrl',
            size: size,
            scope: $scope,
            backdrop: 'static'
        });

        modalInstance.result.then(function () {
            $scope.pathInfo = {};
        }, function () {
            $scope.pathInfo = {};
        });
    };


    /*
     nodesSelect: Multi Select List
     elements: defalut constraints
     attribute: if Node Multi Select Type is 'node' attribute='ip',
     if Node Multi Select Type is 'lable' attribute='lableName'
     */
    $scope.makeConstraints = function (nodesSelect, elements, attribute) {
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
        $scope.deployinfo.constraints = elements;
    };

    // createDirModule
    $scope.openDirModule = function (size) {

        var modalInstance = $uibModal.open({
            templateUrl: '../../views/app/createDirModule.html',
            controller: 'ModalDirCtrl',
            size: size,
            scope: $scope,
            backdrop: 'static'
        });

        modalInstance.result.then(function () {
            $scope.dirInfo = {};
        }, function () {
            $scope.dirInfo = {};
        });
    };

    $scope.funcClick = function (data) {
        if (data.ticked) {
            $scope.ajaxParams.labels.push(data.id);
        } else {
            var index = $scope.ajaxParams.labels.indexOf(data.id);
            $scope.ajaxParams.labels.splice(index, 1);
        }

        glanceHttp.ajaxGet(['cluster.nodeLabelList', ({cluster_id: $scope.clusterid})], function (data) {
            $scope.appLableList = data.data;
            if($scope.appLableList.length){
                $scope.appLableList.map(function(item){
                    item.ticked = true;
                    return item;
                })
            }else {
                $scope.appLableList = $scope.creatAppNodeList.map(function(item) {
                    item.ticked = false;
                    return item;
                });
            }

        }, $scope.ajaxParams, function (data) {

        });

    };

    $scope.funcSelectAll = function(){
        $scope.ajaxParams.labels = [];
        angular.forEach($scope.creatAppLableList, function(lable){
            $scope.ajaxParams.labels.push(lable.id)
        });

        glanceHttp.ajaxGet(['cluster.nodeLabelList', ({cluster_id: $scope.clusterid})], function (data) {
            $scope.appLableList = data.data;
            $scope.appLableList.map(function(item){
                item.ticked = true;
                return item;
            })
        }, $scope.ajaxParams, function (data) {

        });
    };

    $scope.funcSelectNone = function(){
        $scope.ajaxParams.labels = [];
        $scope.appLableList = $scope.creatAppNodeList.map(function(item) {
            item.ticked = false;
            return item;
        });
    }
}
