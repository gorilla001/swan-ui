glanceApp.controller("createappCtrlNew", createappCtrl);

createappCtrl.$inject = ['$scope', '$state', 'glanceHttp', 'Notification'];

function createappCtrl($scope, $state, glanceHttp, Notification) {
    var INNER = '1';
    var OUTER = '2';
    var SELECT_TCP = '1';
    var SELECT_HTTP = '2';
    var HAS_DOMAIN = '1';
    var NO_DOMAIN = '2';

    $scope.step = "stepone";
    $scope.portInfo = {};
    $scope.portInfos = [];
    $scope.portType = {
        "1": "对内",
        "2": "对外"
    };

    $scope.protocolType = {
        "1": "TCP",
        "2": "HTTP"
    };

    $scope.pathInfo = {};
    $scope.pathsInfo = [];

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

    $scope.memOptions = {
        min: 16,
        max: 4096,
        step: 16,
        precision: 2,
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

    $scope.cpuSize = 0.1;
    $scope.memSize = 16;
    $scope.containerNum = 1;
    $scope.imageversion = "";
    $scope.radio = "1";  //defalut apptype for radio box

    $scope.deployApp = function () {
        if($scope.portInfos.length){
            $scope.deployinfo.containerPortsInfo = $scope.portInfos;
        }else{
            delete $scope.deployinfo.containerPortsInfo;
        }

        if($scope.pathsInfo.length){
            $scope.deployinfo.envs = $scope.pathsInfo;
        }else{
            delete $scope.deployinfo.envs;
        }

        if ($scope.cmdInput) {
            $scope.deployinfo.cmd = $scope.cmdInput;
        } else {
            delete $scope.deployinfo.cmd;
        }

        if($scope.radio === '2'){
            if($scope.containerDir && $scope.dateDir){
                $scope.deployinfo.containerVolumesInfo = [];
                var volumesInfo = {
                    containerPath: $scope.containerDir,
                    hostPath: $scope.dateDir
                };
                $scope.deployinfo.containerVolumesInfo.push(volumesInfo);
            }

            $scope.deployinfo.constraints = [["persistent", "LIKE", "persistent"], ["ip", "LIKE", $scope.nodeOkIp]];
        } else if($scope.radio === '1'){
            if($scope.deployinfo.hasOwnProperty('containerVolumesInfo')){
                delete $scope.deployinfo.containerVolumesInfo;
            }
            $scope.deployinfo.constraints = [["transient", "LIKE", "transient"]];
        }

        $scope.deployinfo.clusterId = $scope.clusterid.toString();
        $scope.deployinfo.containerNum = $scope.containerNum.toString();
        $scope.deployinfo.containerCpuSize = $scope.cpuSize;
        $scope.deployinfo.containerMemSize = $scope.memSize;
        $scope.deployinfo.imageversion = $scope.imageversion;
        glanceHttp.ajaxPost(['app.deploy'], $scope.deployinfo, function (data) {
            Notification.success('应用' + $scope.deployinfo.appName + '创建中...');
            $state.go('app.appdetail.config', {appId: data.data});
        }, undefined, null, function (data) {
            Notification.error('应用' + $scope.deployinfo.appName + '创建失败: ' + data.errors);
        });
    };

    $scope.getNodeOkIp = function(nodeOk){
        if(nodeOk) {
          $scope.nodeOkIp = nodeOk.ip;
        }
    };

    $scope.addPortInfo = function(portInfo){
        $scope.portInfos.push(portInfo);
        $scope.portInfo = {};
    };

    $scope.deletCurPort = function(index){
        $scope.portInfos.splice(index,1);
    };

    $scope.addPathInfo = function(pathInfo){
        $scope.pathsInfo.push(pathInfo);
        $scope.pathInfo = {};
    };

    $scope.deletCurPath = function(index){
        $scope.pathsInfo.splice(index,1);
    };

    $scope.changeType = function(portInfoType){
        $scope.portInfo.uri = "";
        if(portInfoType === OUTER && $scope.portInfo.protocol === SELECT_HTTP){
            $scope.portInfo.isUri = HAS_DOMAIN;
            $scope.portInfo.mapPort = 80;
        }else {
            $scope.portInfo.mapPort = "";
            if($scope.portInfo.hasOwnProperty('uri')){
                delete $scope.portInfo.uri
            }
            if($scope.portInfo.hasOwnProperty('isUri')){
                delete $scope.portInfo.isUri;
            }
        }
    };

    $scope.changeProtocol = function(){
        if($scope.portInfo.protocol === SELECT_HTTP && $scope.portInfo.type === OUTER){
            $scope.portInfo.isUri = HAS_DOMAIN;
        }

        if($scope.portInfo.protocol === SELECT_TCP){
            if($scope.portInfo.hasOwnProperty('uri')){
                delete $scope.portInfo.uri
            }
            if($scope.portInfo.hasOwnProperty('isUri')){
                delete $scope.portInfo.isUri;
            }
        }
    };

    $scope.isURI = function(isUri){
        if(isUri === HAS_DOMAIN){
            $scope.portInfo.mapPort = 80;
        }else if(isUri === NO_DOMAIN){
            $scope.portInfo.mapPort = "";
            if($scope.portInfo.hasOwnProperty('uri')){
                delete $scope.portInfo.uri
            }
        }
    };

    $scope.isDisable = function(portInfo){
        if(portInfo.type === INNER && portInfo.mapPort){
            return false;
        }else if(portInfo.type === OUTER && portInfo.isUri === HAS_DOMAIN && portInfo.uri){
            return false
        }else if(portInfo.type === OUTER && portInfo.isUri === NO_DOMAIN && portInfo.mapPort){
            return false;
        }else if(portInfo.protocol === SELECT_TCP && (portInfo.type && portInfo.type !== '') && portInfo.mapPort){
            return false;
        }

        return true;
    }
}
