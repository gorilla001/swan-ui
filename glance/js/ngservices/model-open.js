/**
 * Created by my9074 on 15/12/26.
 */
(function () {
    'use strict';
    angular.module('glance')
        .factory('openModule', openModule);

    openModule.$inject = ['$uibModal'];

    function openModule($uibModal) {
        return {
            open: open
        };

        function open(size, scope, templateUrl, controller, okCallback, cancelCallback, modalResolveCallBack) {
            var modalInstance = $uibModal.open({
                templateUrl: templateUrl,
                controller: controller,
                size: size,
                scope: scope,
                backdrop: 'static',
                resolve: {
                    modalResolve: modalResolveCallBack
                }
            });

            modalInstance.result.then(function () {
                if (okCallback) {
                    okCallback()
                }
            }, function () {
                if (cancelCallback) {
                    cancelCallback()
                }
            });
        }
    }
})();