(function () {
    'use strict';
    angular.module('glance.app')
        .controller('ListTmplCtrl', ListTmplCtrl);

    /* @ngInject */
    function ListTmplCtrl(appcurd, appservice, $state) {
        var self = this;
	self.apps = [];
	self.totalApps = 0;
	self.running = 0;
	self.creating = 0;
	self.failed=0;
        
	appservice.listApps().then(function(data){
		self.apps = data
		self.totalApps = data.length;
		for (i=0; i<data.length; i++) {
			if (data[i].state == "normal") {
				self.running ++ ;
			}
			if (data[i].state == "creating") {
				self.creating ++;
			}
			if (data[i].state == "failed") {
				self.failed ++ ;
			}
		}
	});

	self.delete = function(appId) {
		return appservice.deleteApp(appId).then(function(data){
			$state.go('app.list');
			$state.reload();
		});
		//$state.go('app.deleteStategy', {'app_id': appId});
	};

	self.update = function(appId) {
		return $state.go('app.update', {'app_id': appId, reload: true});
	};

	self.scale = function(appId) {
		return $state.go('app.scale', {'app_id': appId, reload: true});
	};

	self.clone = function(appId) {
		return $state.go('app.clone', {'app_id': appId, reload: true});
	};
    }
})();
