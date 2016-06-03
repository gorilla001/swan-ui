/*@ngInject*/
function glanceUser($cookies, $rootScope, glanceHttp, glanceWS, gHttp, utils) {
    var token;
    
    var init = function() {
        token = $cookies.get("token");
        if (token) {
            glanceHttp.init(token, clear);
            glanceWS.init(token);
            gHttp.setToken(token);
            $rootScope.token = token;
        } else {
            utils.redirectLogin(true);
        }
    };
    
    var clear = function () {
        token = null;
        glanceWS.clear();
        $cookies.remove("token", {domain: DOMAIN});
    };

    return {
        init: init,
        clear: clear
    };
}

glanceApp.factory('glanceUser', glanceUser);