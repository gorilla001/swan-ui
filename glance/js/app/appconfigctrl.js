/**
 * Created by myu on 15-8-19.
 */
glanceApp.controller("appConfigCtrl", appConfigCtrl);

appConfigCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp'];

function appConfigCtrl($scope, $rootScope, $stateParams, glanceHttp) {
    $rootScope.appTabFlag = "appConfig";

    $scope.getConfig = function(){
        glanceHttp.ajaxGet(['app.config',{app_id: $stateParams.appId}], function (data) {
            $scope.config = data.data;
            if($scope.config.ClusterId){
                $scope.getNode($scope.config.ClusterId);
            }
        });
    };

    var promise = $scope.listCluster();
    promise.then($scope.getConfig);
}
