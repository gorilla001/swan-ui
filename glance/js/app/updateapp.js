/**
 * Created by myu on 15-8-21.
 */
glanceApp.controller("updateAppCtrl", updateAppCtrl);

updateAppCtrl.$inject = ['$scope', '$stateParams', '$state', 'glanceHttp'];

function updateAppCtrl($scope, $stateParams, $state, glanceHttp) {
    $scope.app = {
        "appId": $stateParams.appId,
        "clusterId": $stateParams.clusterId,
        "appname": $stateParams.appname,
        "clusterName": $stateParams.clustername
    };

    $scope.deployupdateinfo = {
        "containerPorts":[],
        "appId": parseInt($stateParams.appId),
        "clusterId": $stateParams.clusterId
    };

    $scope.updatePort = {
        "choices": [{id: 'choice1'}],

        "addNewChoice": function(){
            var newItemNo = $scope.updatePort.choices.length+1;
            $scope.updatePort.choices.push({'id':'choice'+newItemNo});
        },
        "removeChoice": function(){
            $scope.updatePort.choices.pop();
        },

        "subNumber": function(){
            $scope.deployupdateinfo.containerPorts = [];
            angular.forEach($scope.updatePort.choices, function(value) {
                $scope.deployupdateinfo.containerPorts.push(value.name);
            });
        }
    };

    $scope.deployUpdateApp = function () {
        $scope.updatePort.subNumber();
        glanceHttp.ajaxPost(['app.deployLatest',{app_id: $stateParams.appId}],$scope.deployupdateinfo,function(data){
            $state.go('app.appdetail.config', {appId:data.data});
        });
    };
}