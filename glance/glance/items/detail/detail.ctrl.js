/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('DetailAppCtrl', DetailAppCtrl);

    /* @ngInject */
    function DetailAppCtrl(appcurd, appservice, $scope, $stateParams, timing, $q) {
	var self = this;
	self.tasks = [];	
	
	self.stateMap = {
		'slot_task_pending_offer': 'pending',
		'slot_task_running': 'running',
		'slot_task_failed': 'failed',
	}
	appservice.getApp($stateParams.app_id).then(function(data){
		self.tasks = data.tasks;
	});
    }
})();
