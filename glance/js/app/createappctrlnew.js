glanceApp.controller("createappCtrlNew", createappCtrl);

createappCtrl.$inject = ['$scope', '$state', 'glanceHttp', 'Notification'];

function createappCtrl($scope, $state, glanceHttp, Notification) {
    $scope.step = "stepone";

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
    $scope.imageversion = "latest";


    $scope.dynamicData = {
        "createEnv": [{id: 'choice1'}],
        "createPort": [{id: 'choice1'}],

        "addNewChoice": function (conditions) {
            var newItemNo;
            var creatLength = $scope.dynamicData[conditions].length;
            var creatData = $scope.dynamicData[conditions];

            if (creatData[creatLength - 1].key &&
                creatData[creatLength - 1].value) {
                newItemNo = creatLength + 1;
                creatData.push({'id': 'choice' + newItemNo});
            } else {
                Notification.warning('输入框有空值,不能继续添加');
            }

            //if(conditions === 'createEnv'){
            //    if (creatData[creatLength - 1].key &&
            //        creatData[creatLength - 1].value) {
            //        newItemNo = creatLength + 1;
            //        creatData.push({'id': 'choice' + newItemNo});
            //    } else {
            //        Notification.warning('输入框有空值,不能继续添加');
            //    }
            //}else if(conditions === 'createPort'){
            //    if (creatData[creatLength - 1].value) {
            //        newItemNo = creatLength + 1;
            //        creatData.push({'id': 'choice' + newItemNo});
            //    } else {
            //        Notification.warning('输入框有空值,不能继续添加');
            //    }
            //}

        },
        "removeChoice": function (conditions) {
            var creatLength = $scope.dynamicData[conditions].length;
            var creatData = $scope.dynamicData[conditions];

            if (creatLength >= 2) {
                creatData.pop();
            } else {
                Notification.warning('不能删除');
            }
        },

        "subNumber": function (conditions) {

            var creatData = $scope.dynamicData[conditions];

            if (conditions === 'createEnv') {
                $scope.deployinfo.envs = {};
                angular.forEach(creatData, function (value) {
                    $scope.deployinfo.envs[value.key] = value.value;
                });
            } else if (conditions === 'createPort') {
                $scope.deployinfo.containerPortsInfo = [];

                //$scope.deployinfo.containerPortsInfo = [];

                //angular.forEach(creatData, function (value) {
                //    $scope.deployinfo.containerPortsInfo.push(value.value);
                //
                //});

                angular.forEach(creatData, function (value) {
                    var portInfo = {};

                    value.hasOwnProperty('uri') ? portInfo = {
                        type: value.key,
                        port: value.value,
                        uri: value.uri
                    }: portInfo = {
                        type: value.key,
                        port: value.value
                    };

                    $scope.deployinfo.containerPortsInfo.push(portInfo);
                });
            }
        }
    };

    $scope.deployApp = function () {
        if ($scope.dynamicData.createPort[0].value && $scope.dynamicData.createPort[0].value)$scope.dynamicData.subNumber('createPort');
        if ($scope.dynamicData.createEnv[0].key && $scope.dynamicData.createEnv[0].value)$scope.dynamicData.subNumber('createEnv');
        if ($scope.cmdInput) {
            $scope.deployinfo.cmd = $scope.cmdInput;
        } else {
            delete $scope.deployinfo.cmd;
        }

        if($scope.radio === '2'){
            $scope.deployinfo.containerVolumesInfo = [];

            var volumesInfo = {
                containerPath: $scope.containerDir,
                hostPath: $scope.dateDir
            };
            $scope.deployinfo.containerVolumesInfo.push(volumesInfo);

            $scope.deployinfo.constraints = [["persistent", "LIKE", $scope.arrId]];
        } else if($scope.radio === '1'){
            if($scope.deployinfo.hasOwnProperty('containerVolumesInfo')){
                delete $scope.deployinfo.containerVolumesInfo;
            }
            $scope.deployinfo.constraints = [["transient", "LIKE", "transient.*"]];
        }

        $scope.deployinfo.clusterId = $scope.clusterid.toString();
        $scope.deployinfo.containerNum = $scope.containerNum.toString();
        $scope.deployinfo.containerCpuSize = $scope.cpuSize;
        $scope.deployinfo.containerMemSize = $scope.memSize;
        $scope.deployinfo.imageversion = $scope.imageversion;
        console.log($scope.deployinfo);
        glanceHttp.ajaxPost(['app.deploy'], $scope.deployinfo, function (data) {
            Notification.success('应用' + $scope.deployinfo.appName + '创建中...');
            $state.go('app.appdetail.instance', {appId: data.data});
        }, undefined, null, function (data) {
            Notification.error('应用' + $scope.deployinfo.appName + '创建失败: ' + data.errors);
        });
    };

    $scope.getNode = function(clusterId){
        $scope.nodesOk = [];
        angular.forEach($scope.clusters, function(value, key) {
            if(value.id === clusterId){
                for(var i =0; i< value.nodes.length; i++){
                    for(var j =0; j < value.nodes[i].attributes.length; j++){
                        if(value.nodes[i].attributes[j].attribute === 'persistent'){
                            $scope.nodesOk.push(value.nodes[i]);
                            break;
                        }
                    }
                }
            }
        });
    };

    $scope.getArrId = function(nodeOk){
        if(nodeOk){
            angular.forEach(nodeOk.attributes, function(value, key) {
                if(value.attribute === 'persistent'){
                    $scope.arrId = "persistent" + value.id;
                }
            });
        }
    }
}