(function () {
    'use strict';
    angular.module('glance.utils')
        .factory('addLabelModal', addLabelModal);

    /* @ngInject */
    function addLabelModal($mdDialog) {
        
        return {
            open: open,
        };

        function open(templateUrl, ev, selected_nodes, father_scope) {
            
            var dialog = $mdDialog.show({
                controller: controller,
                controllerAs: "labelCtrl",
                templateUrl: templateUrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals: { selected_nodes: selected_nodes, father_scope: father_scope },
            });

            return dialog;
        }

        /* @ngInject */
        function controller($scope, $mdDialog, gHttp, labelService, $stateParams, 
                            $state, Notification, ClusterStatusMgr, clusterStatus, selected_nodes, father_scope) {
            
            $scope.cancel = function () {
                $mdDialog.cancel();
            };

           $scope.allLabels = father_scope.allLabels;
           $scope.allLabelNames = father_scope.allLabelNames;
           $scope.selectedLabels = father_scope.selectedLabels;
           $scope.unselectedLabels = father_scope.unselectedLabels;
           $scope.checkedNodeLabels = father_scope.checkedNodeLabels;
           $scope.showNoLabelTip = father_scope.showNoLabelTip;
           $scope.labelForm = {};

           $scope.getAllLabelNames = function(labels, name) {
                 return arrayValuesfromArray(labels, name);
           };

           function arrayValuesfromArray(array, valueKey) {
               var allValues = [];
               for(var i = 0; i < array.length; i++) {
                   allValues.push(array[i][valueKey]);
               }
               return allValues;
           };
           
           $scope.createLabel = function() {
               labelService.createLabel($scope);
           };
     
           $scope.deleteLabel = function(label) {
               labelService.deleteLabel(label, $scope);
           };
           
           $scope.labelledNode = function(label) {
               labelService.labelledNode(label, $scope);
           };

           $scope.tearLabel = function(label) {
               labelService.tearLabel(label, $scope);
           }; 
           
           $scope.tearConfirm = function() {
               father_scope.tearConfirm($scope.unselectedLabels, $mdDialog);
           };
           $scope.labelledConfirm = function() {
               father_scope.labelledConfirm($scope.selectedLabels, $mdDialog);
           }; 
           
        }
    }
})();
