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
            if (event.code != WS_CODE.token_invalide) {
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
            });
        });
    }

    function wsOnMessage(callback, infoType) {
        if (!(infoType in wsCallbacks)) {
            wsCallbacks[infoType] = [];
        }
        wsCallbacks[infoType].push(callback);
    }

    function listenMetrics() {
        wsOnMessage(function (data) {
            $rootScope.$broadcast("newNodeMetric-" + data.nodeId, data);
        }, SUB_INFOTYPE.nodeMetric);
    }

    function listenNodeStatus() {
        wsOnMessage(function (data) {
            $rootScope.$broadcast("nodeStatusUpdate", data);
        }, SUB_INFOTYPE.nodeStatus);
    }
    
    function listenServiceStatus() {
        wsOnMessage(function (data) {
            $rootScope.$broadcast("serviceStatusUpdate", data);
        }, SUB_INFOTYPE.serviceStatus);
    }

    var init = function (token) {
        buildWS(token);
        listenMetrics();
        listenNodeStatus();
        listenServiceStatus();
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