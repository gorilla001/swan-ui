function rootCtrl($scope, $rootScope, $state, glanceUser, gHttp, $window, appcurd, Notification, joinDemoGroupModal) {
    $rootScope.myConfirm = function (msg, callback) {
        $scope._confirmMsg = msg;
        $scope._confirmCallback = callback;
        $('#confirmModal').modal("show");
    };

    $rootScope.IS_OFF_FLAG = IS_OFF_LINE;

    // app list request params
    $rootScope.myAppListParams = {
        searchKeyWord:'',
        page: 1,  //current page index
        count: 20, // current count
        //sorting: { name: 'asc',  appStatus:'asc', containerNum:'asc', clusterId:'asc', update:'asc'} // sorting field
    };
    
    $rootScope.groupAppListParams = {
            searchKeyWord:'',
            page: 1,  //current page index
            count: 20, // current count
            clusterId: null,
            groupId: null
    };

    $rootScope.groupListParams = {
        page: 1,
        count: 20
    };

    // image list request params
    $rootScope.imageListParams = {
        page: 1,  //current page index
        count: 20, // current count
    };

    if(IS_OFF_LINE){
        $scope.userManualUrl = "http://offlinedoc.shurenyun.com/";
    }else{
        $scope.userManualUrl = "http://doc.shurenyun.com";
    }
    
    $scope.getCSUrl = function () {
        var w = window.open();
        gHttp.Resource("auth.customerservice").get().then(function (data) {
            w.location = data.url;
        })
    };

    $scope.logout = function(){
        gHttp.Resource("auth.auth").delete().then(function(){
            glanceUser.clear();
            window.location.href = USER_URL+"/?timestamp="+new Date().getTime();;
        });
    };

    $scope.goBack = function() {
        $window.history.back();
    };

    //set Notice Alert if has notice
    (function () {
        gHttp.Resource("auth.notice").get().then(function (data) {
            if(data){
                $scope.noticeHtml = data.content;
            }
        }).catch(function() {
            console.log("Notice ajax error");
        })
    })();
    
    $scope.FRONTEND_MSG = FRONTEND_MSG;

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            switch (true) {
                case toState.name.startsWith('app'):
                    $rootScope.show = 'application';
                    break;
                case toState.name.startsWith('image'):
                    $rootScope.show = 'image';
                    break;
                case toState.name.startsWith('log'):
                    $rootScope.show = 'log';
                    break;
                case toState.name.startsWith('home'):
                    $rootScope.show = 'home';
                    break;
                case toState.name.startsWith('cluster'):
                    $rootScope.show = 'cluster';
            }
        });

    $rootScope.phoneCodeResendExpire = SMS.phoneCodeResendExpire;

    firstLogin();
    $rootScope.$watch('isFirstLogin', function(newValue, oldValue) {
        if(newValue !== oldValue) {
            firstLogin();
        }
    });

    function firstLogin() {
        if($rootScope.isFirstLogin && $rootScope.demoGroupId) {
            $scope.openJoinDemoGroupModal();
            $rootScope.isFirstLogin = false;
        }
    }

    $scope.openJoinDemoGroupModal = function() {
        if($rootScope.isPhoneVerified) {
            joinDemoGroup().then(function() {
                joinDemoGroupModalSuccess();
            });
        } else {
            joinDemoGroupModal.open().then(function (res) {
                joinDemoGroupModalSuccess();
                $rootScope.isPhoneVerified = true;
            });
        }
    };

    function joinDemoGroupModalSuccess() {
        $rootScope.notInDemoGroup = false;
        $state.go('user.groups', null, {reload: true});
        Notification.success("申请试用成功");
    }

    function joinDemoGroup(data) {
        return gHttp.Resource('user.groupDemo').post(data);
    }
}

rootCtrl.$inject = ["$scope", "$rootScope", "$state", "glanceUser", "gHttp", "$window", "appcurd", 'Notification', 'joinDemoGroupModal'];
glanceApp.controller("rootCtrl", rootCtrl);
