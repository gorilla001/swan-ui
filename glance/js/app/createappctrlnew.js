glanceApp.controller("createappCtrlNew", createappCtrl);

createappCtrl.$inject = ['$scope', '$state', 'glanceHttp', 'Notification', '$uibModal'];

function createappCtrl($scope, $state, glanceHttp, Notification, $uibModal) {
    var INNER = '1';
    var OUTER = '2';
    var SELECT_TCP = '1';
    var SELECT_HTTP = '2';
    var HAS_DOMAIN = '1';
    var NO_DOMAIN = '2';
    var NO_STATE = '1';
    var HAS_STATE = '2';

    $scope.step = "stepone";
    $scope.portInfo = {};
    $scope.portInfos = [];

    $scope.pathInfo = {};
    $scope.pathsInfo = [];

    $scope.dirInfo = {
        hostPath: "",
        containerPath: ""
    };
    $scope.dirsInfo = [];

    $scope.cpuOptions = {
        min: 0.1,
        max: 1.0,
        step: 0.1,
        precision: 1,
        orientation: 'horizontal',
        handle: 'round',
        tooltip: 'always',
        tooltipseparator: ':',
        tooltipsplit: false,
        enabled: true,
        naturalarrowkeys: false,
        range: false,
        reversed: false
    };

    $scope.memFormatter = function (rawValue) {
        return Math.pow(2, rawValue);
    };

    $scope.memOptions = {
        min: 4,
        max: 12,
        step: 1,
        precision: 2,
        orientation: 'horizontal',
        handle: 'round',
        tooltip: 'always',
        tooltipseparator: ':',
        tooltipsplit: false,
        enabled: true,
        naturalarrowkeys: false,
        range: false,
        reversed: false,
        formatter: $scope.memFormatter
    };

    $scope.cpuSize = 0.1;
    $scope.memSize = 4;
    $scope.containerNum = 1;
    $scope.imageversion = "";

    $scope.deployinfo = {
        apptype: "1",        //defalut apptype for radio box
        network: "BRIDGE"    //defalut network for radio box
    };

    $scope.multiTranConfig = {
        selectAll: "全部选择",
        selectNone: "清空",
        reset: "恢复",
        search: "查询匹配词",
        nothingSelected: "All"
    };

    $scope.multiPerConfig = {
        selectAll: "全部选择",
        selectNone: "清空",
        reset: "恢复",
        search: "查询匹配词",
        nothingSelected: "请选择主机"
    };

    $scope.persistentEles = [["persistent", "LIKE", "persistent"]];
    $scope.transientEles = [["transient", "LIKE", "transient"]];

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

        if ($scope.deployinfo.apptype === HAS_STATE) {
            if ($scope.dirsInfo.length) {
                $scope.deployinfo.containerVolumesInfo = $scope.dirsInfo;
            }

            $scope.makeConstraints($scope.persistNodes, $scope.persistentEles);
        } else if ($scope.deployinfo.apptype === NO_STATE) {
            if ($scope.deployinfo.hasOwnProperty('containerVolumesInfo')) {
                delete $scope.deployinfo.containerVolumesInfo;
            }
            $scope.makeConstraints($scope.tranNodes, $scope.transientEles);
        }

        $scope.deployinfo.clusterId = $scope.clusterid.toString();
        $scope.deployinfo.containerNum = $scope.containerNum.toString();
        $scope.deployinfo.containerCpuSize = $scope.cpuSize;
        $scope.deployinfo.containerMemSize = $scope.memFormatter($scope.memSize);
        $scope.deployinfo.imageversion = $scope.imageversion;
        glanceHttp.ajaxPost(['app.deploy'], $scope.deployinfo, function (data) {
            Notification.success('应用' + $scope.deployinfo.appName + '创建中...');
            $state.go('app.appdetail.config', {appId: data.data}, {reload: true});
        }, undefined, null, function (data) {
            Notification.error('应用' + $scope.deployinfo.appName + '创建失败: ' + $scope.addCode[data.code]);
        });
    };

    $scope.getNodeOkIp = function (nodeOk) {
        if (nodeOk) {
            $scope.nodeOkIp = nodeOk.ip;
        }
    };

    $scope.deletCurPort = function (index) {
        $scope.portInfos.splice(index, 1);
    };

    $scope.addPortInfo = function (portInfo) {
        if (isDisableAddList(portInfo, $scope.portInfos, ['type', 'mapPort', 'uri'])) {
            Notification.error('添加的应用地址已存在');
        } else if ((portInfo.mapPort == 80 || portInfo.mapPort == 443) && portInfo.isUri != HAS_DOMAIN && portInfo.type === OUTER) {
            Notification.error('无域名的情况下映射端口不能为 80 443');
        } else {
            $scope.portInfos.push(portInfo);
            $scope.portInfo = {};
        }
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
        if (isDisableAddList(dirInfo, $scope.dirsInfo, ['hostPath', 'containerPath'])) {
            Notification.error('添加的目录重复');
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

    $scope.listCluster();

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

    //multi-nodes-select
    $scope.makeConstraints = function (nodesSelect, elements) {
        var index = 0;
        var regular = "";
        var temp = ["ip", "LIKE"];
        elements.splice(1, elements.length);
        for (; index < nodesSelect.length; index++) {
            if(index == 0){
                regular += nodesSelect[index].ip;
            }else{
                regular += "|" + nodesSelect[index].ip;
            }
        }

        if(nodesSelect.length){
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
}
