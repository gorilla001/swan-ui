(function () {
    'use strict';
    angular.module('glance')
        .directive('dmCopy', dmCopy);

    dmCopy.$inject = ["Notification"];

    function dmCopy(Notification) {
        return {
            restrict: 'A',
            link: function (scope, el, attrs) {
                var clip = new ZeroClipboard(el, {
                    moviePath: "/bower_components/zeroclipboard/dist/ZeroClipboard.swf"
                });
                clip.on("aftercopy", function (event) {
                    Notification.success('复制成功');
                });
            }
        };
    }
})();