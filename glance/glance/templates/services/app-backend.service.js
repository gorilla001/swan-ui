(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appservice', appservice);

    appservice.$inject = ['Notification', 'gHttp'];

    function appservice(Notification, gHttp) {
        //////
        return {
            listApps: listApps,
            createApp: createApp,
            updateApp: updateApp,
            deleteApp: deleteApp,
            getApp: getApp,
	    scaleUp: scaleUp,
	    scaleDown: scaleDown,
        };
        function listApps(params, loading) {
            return gHttp.Resource('app.list').get({params: params, "loading": loading});
        }

        function createApp(data, form) {
            return gHttp.Resource('app.post').post(data, {form: form});
        }

        function updateApp(appId, data, form) {
            return gHttp.Resource('app.update', {app_id: appId}).put(data, {form: form});
        }

        function deleteApp(appId) {
            return gHttp.Resource('app.delete', {app_id: appId}).delete();
        }

        function getApp(appId, loading) {
            return gHttp.Resource('app.show', {app_id: appId}).get({'loading': loading});
        }

	function scaleUp(appId, data, form) {
		return gHttp.Resource('app.scaleup', {app_id: appId}).patch(data, {form: form});
	}

	function scaleDown(appId, data, form) {
		return gHttp.Resource('app.scaledown', {app_id: appId}).patch(data, {form: form});
	}

    }
})();
