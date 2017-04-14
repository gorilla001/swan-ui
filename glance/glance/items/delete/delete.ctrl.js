/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('DeleteAppCtrl', DeleteAppCtrl);

    /* @ngInject */
    function DeleteAppCtrl(appservice,
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
