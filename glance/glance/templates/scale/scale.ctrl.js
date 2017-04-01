/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('ScaleAppCtrl', ScaleAppCtrl);

    /* @ngInject */
    function ScaleAppCtrl(appservice,
                           Notification,
                           $state,
                           $scope,
                           $stateParams,
                           $filter) {
        var self = this;

	
	var instances = 0;
	var scale = false;

	self.form = {
		"instances": 0,
	}

	appservice.getApp($stateParams.app_id).then(function(data){
		self.form.instances = data.currentVersion.instances;
		self.instances = data.currentVersion.instances;
		if (data.state == "scale_up" || data.state == "scale_down") {
			self.scale = true;
		}
	});

	self.scale = function() {
		var delta = self.form.instances - self.instances;
		if (delta > 0 ) {
			return appservice.scaleUp($stateParams.app_id, {'instances': delta}, $scope.staticForm).then(function(data) {
				$state.go('app.list', {reload: true});
			})
		}
		
		return appservice.scaleDown($stateParams.app_id, {'instances': Math.abs(delta)}, $scope.staticForm).then(function(data) {
			$state.go('app.list', {reload: true});
		})
	};

	self.cancel = function() {
		$state.go('app.list', {reload: true});
	};
    }

})();
