/**
 * Created by my9074 on 16/6/17.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('tearLabelDialog', tearLabelDialog);

    /* @ngInject */
    function tearLabelDialog($mdDialog) {

        return {
            open: open
        };

        function open(ev, selectNodes) {

            var dialog = $mdDialog.show({
                controller: TearLabelCtrl,
                controllerAs: "tearLabelCtrl",
                templateUrl: '/glance/cluster/modals/tear-label.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {selectNodes: selectNodes}
            });

            return dialog;
        }

        /* @ngInject */
        function TearLabelCtrl($mdDialog, selectNodes) {
            var self = this;

            activate();

            function activate() {
                listSelectedLabel()
            }

            function listSelectedLabel() {
                var labelList = [];
                var labelIdList = [];
                angular.forEach(selectNodes, function (node, index) {
                    angular.forEach(node.node_labels, function (label, labelIndex) {
                        if (labelIdList.indexOf(label.label.id) == -1) {
                            labelIdList.push(label.label.id);
                            labelList.push(label.label)
                        }

                    })
                });

                self.labels = labelList;
            }

            self.ok = function () {
                var unSelectLabels = [];

                angular.forEach(self.labels, function (item, index) {
                    if (item.tearFlag) {
                        unSelectLabels.push(item.id)
                    }
                });

                $mdDialog.hide(unSelectLabels);
            };

            self.cancel = function () {
                $mdDialog.cancel();
            };
        }
    }
})();
