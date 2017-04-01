/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('CloneAppCtrl', CloneAppCtrl);

    /* @ngInject */
    function CloneAppCtrl(appservice,
                           Notification,
                           $state,
                           $scope,
                           $stateParams,
                           $filter) {
        var self = this;

	
	self.form = {}
	self.appName = ""

	appservice.getApp($stateParams.app_id).then(function(data){
		self.form = data.currentVersion;
		self.appName = self.form.appName + "clone";
		console.log(self.appName);
	});

	self.clone = function() {
		self.form.appName = self.appName;
		appservice.createApp(self.form, $scope.staticForm).then(
				function(data) {
					$state.go('app.list', {reload: true});
				});
	};

	self.stategy = function() {
		$state.go('app.updateStategy', {reload: true});
	};

	self.cancel = function() {
		$state.go('app.list', {reload: true});
	};
    }

})();
