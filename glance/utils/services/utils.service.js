(function () {
    'use strict';
    angular.module('glance.utils')
        .factory('utils', utils);

    utils.$inject = ["Notification"];

    function utils(Notification) {
        var clickToCopy = function () {
            $(".copy").each(function () {
                var clip = new ZeroClipboard($(this), {
                    moviePath: "/bower_components/zeroclipboard/dist/ZeroClipboard.swf"
                });
                clip.on("aftercopy", function (event) {
                    Notification.success('复制成功');
                });
            });
        };


        function getUrlTemplate(name) {
            var confs = name.split('.');
            var categoryKey = confs[0];
            var detailKey = confs[1];
            var base;
            if (BACKEND_URL_BASE[categoryKey]) {
                base = BACKEND_URL_BASE[categoryKey];
            } else {
                base = BACKEND_URL_BASE.defaultBase;
            }
            return base + BACKEND_URL[categoryKey][detailKey];
        }

        var buildFullURL = function (name, params) {
            var url = getUrlTemplate(name);
            if (params) {
                $.each(params, function (key, val) {
                    url = url.replace("$" + key, val);
                });
            }
            return url;
        };

        var createPages = function (cur, total) {
            var pages = [];
            for (var i = 0; i < total; i++) {
                var page = {"num": i, "tag": i + 1, "isCur": false};
                if (cur == i) {
                    page["isCur"] = true;
                }
                pages.push(page);
            }
            return pages;
        };

        return {
            buildFullURL: buildFullURL,
            clickToCopy: clickToCopy,
            createPages: createPages
        }
    }

})();