function utils() {
    var clickToCopy = function() {
        $(".copy").each(function () {
            var clip = new ZeroClipboard($(this), {
                moviePath: "/bower_components/zeroclipboard/dist/ZeroClipboard.swf"
            });
        });
    };

    function getBaseUrl(urlKey) {
        var confs = urlKey.split('.');
        var categoryKey = confs[0];
        var detailKey = confs[1];
        return BACKEND_URL[categoryKey].base + BACKEND_URL[categoryKey][detailKey];
    }

    var buildFullURL = function(urlParams) {
        var urlKey = urlParams[0];
        var url = getBaseUrl(urlKey);
        if (urlParams.length > 1) {
            $.each(urlParams[1], function(key, val) {
                url = url.replace("$" + key, val);
            });
        }
        return url;
    }
    
    var createPages = function (cur, total) {
        var pages = [];
        for (var i = 0; i < total; i++) {
            var page = {"num": i, "tag": i+1, "isCur": false};
            if (cur == i){
                page["isCur"] = true;
            }
            pages.push(page);
        }
        return pages;
    }
    
    return {
        buildFullURL: buildFullURL,
        clickToCopy: clickToCopy,
        createPages: createPages
    }
}

glanceApp.factory('utils', utils);
