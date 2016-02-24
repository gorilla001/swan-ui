function modifyPasswordCtrl($scope, $rootScope, $window, Notification, gHttp) {
    $rootScope.show = '';
    $scope.form = {
        old_password: '',
        new_password: '',
        new_password_compare: ''
    };

    $scope.modifyPassword = function(){
        gHttp.Resource("auth.password").put($scope.form, {"form": $scope.staticForm}).then(function () {
            alert('密码修改成功！');
            $window.history.back();
        });
    }

    $scope.goBack = function() {
        $window.history.back();
    }
}
modifyPasswordCtrl.$inject = ['$scope', '$rootScope', '$window', 'Notification', 'gHttp'];
glanceApp.controller('modifyPasswordCtrl', modifyPasswordCtrl);