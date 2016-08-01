(function () {
    'use strict';
    angular.module('glance.app')
        .directive('healthyBar', healthyBar);
    function healthyBar($parse) {
        return {
            restrict: "A",
            scope: {
                health: '=health',
                unhealth: '=unhealth',
                unknown: '=unknown'
            },
            link: function (scope, ele, attrs) {
                ele.addClass('appHealthBar');
                if (scope.unhealth) {
                    ele[0].style.background = "red";
                }
                if (scope.health) {
                    ele.append('<div class="helthBarTop"></div>');
                    var helthBarTop = $('.helthBarTop', ele)[0];
                    helthBarTop.style.position = "absolute";
                    helthBarTop.style.top = "0";
                    helthBarTop.style.width = scope.health / (scope.health + scope.unhealth + scope.unknown) * 80 + 'px';
                    helthBarTop.style.height = "10px";
                    helthBarTop.style.background = 'green';
                    helthBarTop.style.borderRadius = '10px';
                }
            }
        };
    }
})();
