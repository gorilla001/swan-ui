/*global angular,glanceApp */
function glanceWS($rootScope, ngSocket, utils, monitor) {
    var ws;
    var wsCallbacks = {};

    function buildWS(token) {
        var url = utils.buildFullURL("ws.subscribe", {token: token});
        if (url.substring(0, 4) == "http") {
            url = "ws"+url.substring(4);
        }
        ws = ngSocket(url);
        ws._onCloseHandler = function (event) {
            if (ws && event.code != $rootScope.WS_CODE.token_invalide) {
                ws.reconnect();
            }
        };
        ws.socket.onclose = ws._onCloseHandler;
        ws.onMessage(function (msg) {
            var dataItems = JSON.parse(msg.data);
            if (!angular.isArray(dataItems)) {
                dataItems = [dataItems];
            }
            angular.forEach(dataItems, function (data) {
                if (wsCallbacks[data.type]) {
                    angular.forEach(wsCallbacks[data.type], function (callback) {
                        try{
                            callback(data.message);
                        } catch (e) {
                            console.log("ws callback error:",data, e);
                        }
                    });
                }
                $rootScope.$broadcast(data.type, data.message);
            });
        });
    }

    function wsOnMessage(callback, infoType) {
        if (!(infoType in wsCallbacks)) {
            wsCallbacks[infoType] = [];
        }
        wsCallbacks[infoType].push(callback);
    }

    var init = function (token) {
        buildWS(token);
    };

    var clear = function () {
        ws.close();
        ws = null;
    };

    return {
        init: init,
        clear: clear
    };
}
glanceWS.$inject = ["$rootScope", "ngSocket", "utils", "monitor"];
glanceApp.factory('glanceWS', glanceWS);