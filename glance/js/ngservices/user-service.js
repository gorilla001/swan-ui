function glanceUser($cookieStore, $rootScope, glanceHttp, glanceWS, gHttp) {
    var token;
    
    var init = function() {
        token = $cookieStore.get("token");
        if (token) {
            glanceHttp.init(token, clear);
            glanceWS.init(token);
            gHttp.setToken(token);
            $rootScope.token = token;
        } else {
            window.location.href = USER_URL+"/?timestamp="+new Date().getTime();;
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

glanceUser.$inject = ["$cookieStore", "$rootScope", "glanceHttp", "glanceWS", "gHttp"];
glanceApp.factory('glanceUser', glanceUser);