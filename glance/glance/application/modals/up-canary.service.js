(function () {
    'use strict';
    angular.module('glance.app')
        .factory('upCanaryModal', upCanaryModal);

    /* @ngInject */
    function upCanaryModal($uibModal) {

        return {
            open: open
        };

        function open(versions) {
            var modalInstance = $uibModal.open({
                templateUrl: '/glance/application/modals/up-canary.html',
                controller: UpCanaryCtrl,
                controllerAs: 'formCtrl',
                resolve: {
                    versions: function () {
                        return versions
                    }
                }
            });

            return modalInstance.result;
        }

        /* @ngInject */
        function UpCanaryCtrl($uibModalInstance, versions, $scope) {

            var self = this;

            self.total;
            self.versions = getVersions(versions);
            self.ok = function () {
                $uibModalInstance.close(self.versions)
            };
            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            
            $scope.$watch('formCtrl.versions', function (nval, oval) {
                self.total = sumWeight();
            }, true)
            
            function sumWeight() {
                var total = 0;
                angular.forEach(self.versions, function (version) {
                    total += version.weight;
                })
                return total;
            }
            
            function getVersions(versions) {
                var tarVersions = [];
                angular.forEach(versions, function (version) {
                    if (version.canary == 1 || version.currentDeploy == 1) {
                        tarVersions.push(version);
                    }
                });
                return tarVersions;
            }

        }
    }
})();