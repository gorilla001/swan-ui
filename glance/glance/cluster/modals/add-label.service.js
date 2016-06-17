(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('addLabelDialog', addLabelDialog);

    /* @ngInject */
    function addLabelDialog($mdDialog) {

        return {
            open: open
        };

        function open(ev) {

            var dialog = $mdDialog.show({
                controller: AddLabelCtrl,
                controllerAs: "addLabelCtrl",
                templateUrl: '/glance/cluster/modals/add-label.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });

            return dialog;
        }

        /* @ngInject */
        function AddLabelCtrl($mdDialog, clusterBackend) {
            var self = this;

            self.deleteLabel = deleteLabel;
            self.createLabel = createLabel;

            activate();

            function activate() {
                listLabels()
            }

            function listLabels() {
                clusterBackend.listLabels()
                    .then(function (data) {
                        self.labels = data;

                        //labelArray used to dm-check-include directive
                        self.labelArray = self.labels.map(function (item, index) {
                            return item.name
                        })
                    })
            }

            function deleteLabel(labelId, index) {
                var labelArray = [];
                labelArray.push(labelId);

                clusterBackend.deleteLabel(labelArray)
                    .then(function (data) {
                        self.labels.splice(index, 1)
                    })
            }

            function createLabel(labelName) {
                clusterBackend.createLabel(labelName)
                    .then(function (data) {
                        data.selectFlag = true;
                        self.labels.push(data);
                    })
            }

            self.ok = function () {
                var selectLabels = [];

                angular.forEach(self.labels, function (item, index) {
                    if (item.selectFlag) {
                        selectLabels.push(item.id)
                    }
                });

                $mdDialog.hide(selectLabels);
            };
            self.cancel = function () {
                $mdDialog.cancel();
            };
        }
    }
})();
