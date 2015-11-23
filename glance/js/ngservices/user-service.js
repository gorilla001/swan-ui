function glanceUser($cookieStore, $rootScope, glanceHttp, glanceWS) {
    var token;
    
    var init = function() {
        token = $cookieStore.get("token");
        if (token) {
            glanceHttp.init(token, clear);
            glanceWS.init(token);
        } else {
            window.location.href = USER_URL;
            $rootScope.$destroy();
        }
    };
    
    var clear = function () {
        token = null;
        glanceWS.clear();
        $cookieStore.remove("token");
    };

    return {
        init: init,
        clear: clear
    };
}

glanceUser.$inject = ["$cookieStore", "$rootScope", "glanceHttp", "glanceWS"]
glanceApp.factory('glanceUser', glanceUser);