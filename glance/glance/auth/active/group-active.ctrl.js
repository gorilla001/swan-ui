(function (argument) {
    'use strict';

    angular.module('glance.auth')
      .controller('GroupActiveCtrl', GroupActiveCtrl);

    /* @ngInject */
    function GroupActiveCtrl($location, authBackend) {
        var self = this;
        var urlParmas = $location.search();
        
        activate()

        function activate() {
            return authBackend.groupActive(urlParmas.invite)
                .then(function(data) {
                    self.resultMessage = "加入用户组成功！";
                }, function(res) {
                    if (CODE_MESSAGE[res.code]) {
                        self.resultMessage = CODE_MESSAGE[res.code];
                    } else {
                        self.resultMessage = "加入用户组失败！"
                    }
                });
        }

    }
})();