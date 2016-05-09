(function () {
    'use strict';

    angular.module('glance.utils').factory('gHttp', gHttp);

    gHttp.$inject = ['utils', '$q', '$rootScope', '$http', 'Notification', '$state','$cookies', 'cfpLoadingBar'];
    function gHttp(utils, $q, $rootScope, $http, Notification, $state, $cookies, cfpLoadingBar) {
        var token;

        var ResourceCls = buildResourceCls();

        return {
            setToken: setToken,
            Resource: Resource
        };

        function setToken(val) {
            token = val;
        }

        function Resource(urlName, params) {
            return new ResourceCls(urlName, params);
        }

        function buildResourceCls() {
            function Resource(urlName, params) {
                this.url = utils.buildFullURL(urlName, params);
                this.options = {
                    isAuth: true,
                    loading: 'default',
                    ignoreCodes: [] //忽略错误码对应通知的集合
                }
            }

            Resource.prototype.get = function (options) {
                return this.req('get', options);
            };

            Resource.prototype.post = function (data, options) {
                return this.dataReq('post', data, options);
            };

            Resource.prototype.put = function (data, options) {
                return this.dataReq('put', data, options);
            };

            Resource.prototype.patch = function (data, options) {
                return this.dataReq('patch', data, options);
            };

            Resource.prototype.dataReq = function (method, data, options) {
                if (!options) {
                    options = {};
                }
                options.data = data;
                if (options.form) {
                    options.form.$setPristine();
                    options.form.message_error_info = {};

                    options.ignoreCodes = options.ignoreCodes || [];
                    options.ignoreCodes.push(MESSAGE_CODE.dataInvalid)
                }
                var promise = this.req(method, options);
                if (options.form) {
                    promise.catch(function (data) {
                        if (data.code === MESSAGE_CODE.dataInvalid) {
                            options.form.message_error_info = data.data;
                        }
                    });
                }
                return promise;
            };

            Resource.prototype.delete = function (options) {
                return this.req('delete', options);
            };

            Resource.prototype.req = function (method, options) {
                angular.forEach(options, function (value, key) {
                    if (value !== undefined) {
                        this.options[key] = value;
                    }
                }.bind(this));
                var headers = {
                    'Content-Type': 'application/json; charset=UTF-8'
                };
                if (this.options.isAuth) {
                    headers["Authorization"] = token;
                }
                var req = {
                    method: method,
                    url: this.url,
                    headers: headers,
                    cache: false,
                    data: this.options.data,
                    params: this.options.params
                };

                if(!this.options.loading){
                    req.ignoreLoadingBar = true;
                }
                var deferred = $q.defer();
                $http(req).success(function (data) {
                    if (data.code === MESSAGE_CODE.success) {
                        deferred.resolve(data.data);
                    } else if (data.code === MESSAGE_CODE.noExist) {
                        $state.go('404');
                    } else {
                        if (!this.options.ignoreCodes.includes(data.code) && CODE_MESSAGE[data.code]) {
                            Notification.error(CODE_MESSAGE[data.code]);
                        }

                        deferred.reject(data);
                    }
                }.bind(this)).error(function (data, status) {
                    this._handleErrors(status);
                }.bind(this));

                return deferred.promise;

            };

            Resource.prototype._handleErrors = function (status) {
                if (status == 401) {
                    $cookies.remove('token');
                    window.location.href = USER_URL + "/user/login?return_to=" + encodeURIComponent(window.location.href) 
                                            + "?timestamp=" + new Date().getTime();
                    $rootScope.$destroy();
                } else if (status == 404) {
                    $state.go('404');
                } else {
                    Notification.error("服务忙，请稍后再试");
                }
            };

            return Resource;
        }
    }
})();