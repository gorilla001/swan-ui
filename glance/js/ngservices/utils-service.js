function utils() {
    var clickToCopy = function() {
        $(".copy").each(function () {
            var clip = new ZeroClipboard($(this), {
                moviePath: "/bower_components/zeroclipboard/dist/ZeroClipboard.swf"
            });
        });
    };
    
    function getUrlBase(categoryKey, is_ws) {
        if (BACKEND_URL[categoryKey].base) {
            return BACKEND_URL[categoryKey].base;
        } else {
            var protocol = "http";
            if (is_ws) {
                protocol = "ws";
            }
            if (BACKEND_URL.defaultBase.isSSL) {
                protocol = protocol+"s";
            }
            return protocol+"://" + BACKEND_URL.defaultBase.url;
        }
    }

    function getUrlTemplate(urlName, is_ws) {
        var confs = urlName.split('.');
        var categoryKey = confs[0];
        var detailKey = confs[1];
        return getUrlBase(categoryKey, is_ws) + BACKEND_URL[categoryKey][detailKey];
    }

    var buildFullURL = function(urlName, params, is_ws) {
        var url = getUrlTemplate(urlName, is_ws);
        if (params) {
            $.each(params, function(key, val) {
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
