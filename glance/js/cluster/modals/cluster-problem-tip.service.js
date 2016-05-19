(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('clusterProblemTipModal', clusterProblemTipModal);

    
    /* @ngInject*/
    function clusterProblemTipModal($mdDialog) {

        return {
            open: open
        };

        function open(cluster, ev) {
            return $mdDialog.show({
                controller: ClusterProblemTipModalCtrl,
                templateUrl: '/views/cluster/modals/cluster-problem-tip.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {cluster: cluster},
                clickOutsideToClose:true
           })
        }

        /* @ngInject */
        function ClusterProblemTipModalCtrl($scope, $mdDialog, cluster) {
            
            $scope.cluster = cluster;
            
            $scope.close = function () {
                $mdDialog.hide()
            };

            $scope.cancel = function () {
                console.log(11111)
                $mdDialog.cancel();
            };
        }
    }
})();