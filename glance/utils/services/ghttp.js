(function () {
    'use strict';

    angular.module('glance.utils').factory('gHttp', gHttp);

    gHttp.$inject = ['utils', '$q', '$rootScope', '$http', 'Notification', '$state'];
    function gHttp(utils, $q, $rootScope, $http, Notification, $state) {
        var token;

        if (!$rootScope.loadings) {
            $rootScope.loadings = {};
        }

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
                    loading: 'default'
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
            }

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

                this._startLoading(this.options.loading);

                var deferred = $q.defer();
                $http(req).success(function (data) {
                    this._stopLoading(this.options.loading);
                    if (data.code === MESSAGE_CODE.success) {
                        deferred.resolve(data.data);
                    } else if (data.code === MESSAGE_CODE.noExist){
                        $state.go('404');
                    } else if (data.code === MESSAGE_CODE.noPermission) {
                        Notification.error("您没有权限进行此操作");
                    } else {
                        deferred.reject(data);
                    }
                }.bind(this)).error(function (data, status) {
                    this._stopLoading(this.options.loading);
                    this._handleErrors(status);
                }.bind(this));

                return deferred.promise;

            };

            Resource.prototype._startLoading = function (loading) {
                if (loading) {
                    if (!$rootScope.loadings[loading]) {
                        $rootScope.loadings[loading] = 1;
                    } else {
                        $rootScope.loadings[loading] += 1;
                    }
                }
            };

            Resource.prototype._stopLoading = function (loading) {
                if (loading) {
                    $rootScope.loadings[loading] -= 1;
                }
            };

            Resource.prototype._handleErrors = function (status) {
                if (status == 401) {
                    window.location.href = USER_URL+"/user/login?return_to="+window.location.href+"?timestamp="+new Date().getTime();
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