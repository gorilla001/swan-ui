(function () {
    'use strict';
    angular.module('glance.common')
        .factory('commonBackend', commonBackend);

    /* @ngInject */
    function commonBackend(gHttp) {
        return {
            getCSUrl: getCSUrl,
            logout: logout,
            getNotice: getNotice,
            joinDemoGroup: joinDemoGroup
        };
        
        function getCSUrl() {
            return gHttp.Resource("auth.customerservice").get()
        }

        function logout() {
            return gHttp.Resource("auth.auth").delete()
        }

        function getNotice(){
            return gHttp.Resource("auth.notice").get()
        }

        function joinDemoGroup(data){
            return gHttp.Resource('user.groupDemo').post(data);
        }

    }

})();