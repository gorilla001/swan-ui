function modifyPasswordCtrl($scope, $rootScope, glanceHttp, $window, Notification) {
    $rootScope.show = '';
    $scope.form = {
        old_password: '',
        new_password: '',
        new_password_compare: ''
    };
    $scope.message_error_info = {};

    $scope.modifyPassword = function(){
        glanceHttp.ajaxFormPut($scope, ["auth.password"], function() {
            // Notification.success('密码修改成功！');
            alert('密码修改成功！');
            $window.history.back();
        });
    }

    $scope.goBack = function() {
        $window.history.back();
    }
}
modifyPasswordCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', '$window', 'Notification'];
glanceApp.controller('modifyPasswordCtrl', modifyPasswordCtrl);