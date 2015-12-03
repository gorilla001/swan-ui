/**
 * Created by myu on 15-9-22.
 */
glanceApp.controller("dynamicBaseCtrl", dynamicBaseCtrl);

dynamicBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp'];

function dynamicBaseCtrl($scope, $rootScope, glanceHttp) {
    $rootScope.show = "dynamic";
    $scope.list = [1,2,3,4]

}