(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appLabelService', appLabelService);

    appLabelService.$inject = ['clusterBackend'];

    function appLabelService(clusterBackend) {
        return {
            listClusterLabels: listClusterLabels,
            listNodesByLabelIds: listNodesByLabelIds
        };

        /////////////////

        function listClusterLabels(nodes) {
            var labels = [];
            var labelsNames = [];
            angular.forEach(nodes, function(node, index) {
                angular.forEach(node.node_labels, function(label, labelIndex){
                    if (labelsNames.indexOf(label.label.name) === -1) {
                        labelsNames.push(label.label.name);
                        labels.push({id: label.label.id, name: label.label.name});
                    }
                });
            });
            return labels;
        }

        function  listNodesByLabelIds(selectedLables, clusterId) {
            var labelIds = collectIds(selectedLables);
            var labelIdsString = labelIds.join(',');
            return clusterBackend.listNodesByLabelIds(clusterId, labelIdsString);
        }
        
        //////////////

        function collectIds(items) {
            var ids = [];
            angular.forEach(items, function(item, index) {
                ids.push(item.id);
            });
            return ids;
        }

        
    }
})();