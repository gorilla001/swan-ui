(function () {
    'use strict';
    angular.module('glance.layout')
        .factory('layoutBackend', layoutBackend);


    /* @ngInject */
    function layoutBackend(gHttp) {
        return {
            create: create,
            deploy: deploy,
            deleteStack: deleteStack,
            listStackApps: listStackApps,
            list: list,
            update: update
        };

        function create(data, clusterId) {
            return gHttp.Resource('stack.stacks', {cluster_id: clusterId}).post(data);
        }

        function deploy(clusterId, stackId) {
            return gHttp.Resource('stack.deploy', {cluster_id: clusterId, stack_id: stackId}).put();
        }

        function deleteStack(clusterId, stackId) {
            return gHttp.Resource('stack.stack', {cluster_id: clusterId, stack_id: stackId}).delete();
        }

        function listStackApps(stackId, clusterId) {
            return gHttp.Resource('stack.stack', {cluster_id: clusterId, stack_id: stackId}).get();
        }

        function list(loading) {
            return gHttp.Resource('stack.listStack').get({loading: loading});
        }

        function update(data, clusterId, stackId) {
            return gHttp.Resource('stack.stack', {cluster_id: clusterId, stack_id: stackId}).put(data);
        }

    }
})();