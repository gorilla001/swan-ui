(function() {
    'use strict';
    
    angular.module('glance').factory('gHttp', gHttp);
    
    gHttp.$inject = ['utils', '$q', '$rootScope', '$http']
    function gHttp(utils, $q, $rootScope, $http) {
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
                    loading: 'default',
                    ignoreErrorcodes: []
                }
            }
            
            Resource.prototype.get = function(options) {
                return this.req('get', options);
            };
            
            Resource.prototype.post = function(data, options) {
                if (!options) {
                    options = {};
                }
                options.data = data;
                return this.req('post', options);
            };
            
            Resource.prototype.put = function(data, options) {
                if (!options) {
                    options = {};
                }
                options.data = data;
                return this.req('put', options);
            };
            
            Resource.prototype.delete = function(options) {
                return this.req('delete', options);
            };
            
            Resource.prototype.req = function(method, options) {
                angular.extend(this.options, options);
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
                    if (data && (data.code == undefined || data.code === MESSAGE_CODE.success)) {
                        if (data.data) {
                            data = data.data;
                        }
                        deferred.resolve(data);
                    } else {
                        this._handleErrors(200, data, deferred);
                    }
                }.bind(this)).error(function (data, status) {
                    this._stopLoading(this.options.loading);
                    this._handleErrors(status, data, deferred);
                }.bind(this));
                
                return deferred.promise;
                
            };
            
            Resource.prototype._startLoading = function(loading) {
                if (loading) {
                    if (!$rootScope.loadings[loading]) {
                        $rootScope.loadings[loading] = 1;
                    } else {
                        $rootScope.loadings[loading] += 1;
                    }
                }
            };
            
            Resource.prototype._stopLoading = function(loading) {
                if (loading) {
                    $rootScope.loadings[loading] -= 1;
                }
            };
            
            Resource.prototype._handleErrors = function(status, data, deferred) {
                if (status == 401) {
                    window.location.href = USER_URL;
                    $rootScope.$destroy();
                } else if (status == 403) {
                    Notification.error("您没有权限进行此操作");
                } else if(status === 404) {
                    $state.go('404');
                } else {
                    if (this.options.ignoreErrorcodes!='all' && this.options.ignoreErrorcodes.indexOf(data.code) < 0) {
                        Notification.error("服务忙，请稍后再试");
                    }
                    deferred.reject(data.code, data.errors, status);
                }
            }
            
            return Resource;
        }
    }
})();