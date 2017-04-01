/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('UpdateAppCtrl', UpdateAppCtrl);

    /* @ngInject */
    function UpdateAppCtrl(appservice,
                           Notification,
                           $state,
                           $scope,
                           $stateParams,
                           $filter) {
        var self = this;

	
	self.form = {}

	appservice.getApp($stateParams.app_id).then(function(data){
		console.log(data);
		self.form = data.currentVersion;
	});

	self.update = function() {
		console.log(self.form);
		console.log($stateParams.app_id);
		appservice.updateApp($stateParams.app_id, self.form, $scope.staticForm).then(
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
