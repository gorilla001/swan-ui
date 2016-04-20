(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('CreateScalingCtrl', CreateScalingCtrl);

    /* @ngInject */
    function CreateScalingCtrl(target, appservice, scaling, $state, $stateParams, Notification) {
        var self = this;
        self.target = target;
        self.form = {

        };

        activate();

        function activate() {
            getAppList()
        }

        function getAppList(){
            appservice.listApps()
                .then(function (data) {
                    self.apps = data.App;
                })
        }

    }
})();