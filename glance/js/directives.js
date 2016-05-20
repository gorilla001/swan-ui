glanceApp.directive('ckbBatchAll', function(){
    return {
        restrict: 'A',
        scope: {
            prop: "=ckbBatchAll"
        },
        link: function (scope, elm) {
            if (!scope.prop) {
                scope.prop = {value: [], caTrigger:false, isAllChecked:false, total: 0}
            }
            elm.change(function () {
                scope.prop.isAllChecked = elm.prop("checked");
                scope.prop.caTrigger = !scope.prop.caTrigger;
                scope.$apply();
            });
            scope.$watchCollection("prop.value", function (nv, ov) {
                if (nv != ov) {
                    if (nv.length > 0 && nv.length == scope.prop.total) {
                        elm.prop("checked", true);
                        scope.prop.isAllChecked = true;
                    } else {
                        elm.prop("checked", false);
                        scope.prop.isAllChecked = false;
                    }
                }
            })
        }
    }
});

glanceApp.directive('ckbBatch', function(){
    return {
        restrict: 'A',
        scope: {
            prop: "=ckbBatch"
        },
        link: function (scope, elm, attrs) {
            if (!scope.prop) {
                scope.prop = {value: [], caTrigger: false, isAllChecked:false, total: 0};
            }
            scope.prop.total += 1;
            function onChange() {
                var idx = scope.prop.value.indexOf(attrs.value);
                if (elm.prop("checked") && idx < 0) {
                    scope.prop.value.push(attrs.value);
                } else if (!elm.prop("checked") && idx > -1){
                    scope.prop.value.splice(idx, 1);
                }
            }
            elm.change(function(){
                onChange();
                scope.$apply();
            });
            scope.$watch("prop.caTrigger", function (nv, ov) {
                if (nv != ov) {
                    if (scope.prop.isAllChecked) {
                        elm.prop("checked", true);
                    } else {
                        elm.prop("checked", false);
                    }
                    onChange();
                }
            });
            elm.on("$destroy", function () {
                scope.prop.total -= 1;
                var idx = scope.prop.value.indexOf(attrs.value);
                if (idx > -1) {
                    scope.prop.value.splice(idx, 1);
                    scope.$apply();
                }
            })
        }
    }
});

glanceApp.directive('dateFormat', ['$filter',function($filter) {
    var dateFilter = $filter('date');
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            function formatter(value) {
                return dateFilter(value, 'yyyy-MM-dd HH:mm');
            }

            function parser() {
                return ctrl.$modelValue;
            }

            ctrl.$formatters.push(formatter);
            ctrl.$parsers.unshift(parser);

        }
    };
}]);

glanceApp.directive('regexValidator', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, ele, attrs, ctrl) {
            var regex = /([A-Za-z0-9\?\,\.\:\;\'\"\!\(\)])*[A-Z]/;
            function valueLength(value) {
                var length = value.length;
                return Boolean(length <= 0 || (length >= 8 && length <= 16));
            };

            ctrl.$parsers.unshift(function(value) {
                var valid = true;
                if (value) {
                    var len = valueLength(value);
                    var reg = regex.test(value);
                    valid = Boolean(reg && len);
                }
                ctrl.$setValidity('regexValidator', valid);
                return valid ? value : undefined;
            });

            ctrl.$formatters.unshift(function(value) {
                var valid = true;
                if (value) {
                    var reg = regex.test(value);
                    var len = valueLength(value);
                    valid = Boolean(reg && len);
                }

                ctrl.$setValidity('regexValidator', valid);
                return value;
            });
        }
    };
});

glanceApp.directive('valueMatch', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            var firstValue = attrs.valueMatch;
            elem.add(firstValue).on('keyup', function() {
                scope.$apply(function() {
                    var valid = true;
                    if (elem.val()) {
                        valid = Boolean((elem.val() === $(firstValue).val()));
                    }
                    ctrl.$setValidity('valueMatch', valid);
                    return valid ? elem.val() : undefined;
                });
            });
        }
    };
});

glanceApp.directive('nameRepaetValidator', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            ctrl.$parsers.unshift(function(value) {
                var valid = Boolean(scope.clusterNames.indexOf(value.toString()) === -1);
                ctrl.$setValidity('nameRepaetValidator', valid);
                return valid ? value : undefined;
            });
        }
    };
});

glanceApp.directive('samename', function () {
    return {
        restrict: "A",
        require: 'ngModel',
        scope: {
            names: '=nameList',
            nameIndex: '=nameIndex'
        },
        link: function (scope, ele, attrs, ngModelController) {
            ngModelController.$validators.samename = function(modelValue, viewValue) {
                var list;
                if (ngModelController.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }

                if(angular.isFunction(scope.names)){
                    list = scope.names(scope.nameIndex);
                }else{
                    list = scope.names;
                }
                if (list.indexOf(modelValue) == -1) {
                    // it is valid
                    return true;
                }

                // it is invalid
                return false;
            };
        }
    };
});

glanceApp.directive('piechart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            used: '=chartUsed',
            total: '=chartTotal',
            usecolor: '@useColor',
            backgroundColor: '@backgroundColor',
            radius: '=radius',
            showText: '@showText',
            textcolor: '@textColor',
            errorCode: '=errorCode',
            statusText: '=status',
            fontSize: '@fontSize'

        },
        link: function (scope, elem, attrs, ctrl) {

            if (scope.total - scope.used <= 0) {
                scope.usecolor = '#FF3030';
            }

            var labelTop = {
                normal: {
                    color: scope.usecolor || "#68d1f2",
                    label: {
                        show: true,
                        position: 'center',
                        formatter: '{b}',
                        textStyle: {
                            fontSize: scope.fontSize,
                            baseline: 'bottom',
                            color: scope.textcolor || "#68d1f2"
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }
            };

            var labelBottom = {
                normal: {
                    color: scope.backgroundColor || "#D9E4EB",
                    label: {
                        show: true,
                        position: 'center',
                        formatter: scope.showText || "pieCart",
                        textStyle: {
                            fontSize: 10,
                            color: '#8A95A5'
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }
            };

            var labelFromatter = {
                normal: {
                    label: {
                        show: false,
                        textStyle: {
                            baseline: 'top',
                            fontSize: 8,
                            color: '#000000'
                        }
                    }
                }
            };

            function createOption() {
                return {
                    series: [
                        {
                            type: 'pie',
                            radius: scope.radius || [45, 55],
                            itemStyle: labelFromatter,
                            data: [
                                {
                                    name: function () {
                                                if(scope.errorCode != undefined){
                                                    if(scope.statusText == 1){
                                                        return '部署中'
                                                    }else if(scope.statusText == 3){
                                                        return '已停止'
                                                    }else if(scope.statusText == 4){
                                                        return '停止中'
                                                    }else if(scope.statusText == 5){
                                                        return '删除中'
                                                    }else if(scope.statusText == 6){
                                                        return '扩展中'
                                                    }else {
                                                        if (scope.total && scope.used) {
                                                            return (scope.used / scope.total * 100).toFixed(2) + '%'
                                                        } else if (scope.used == undefined || !scope.total) {
                                                            return '异常'
                                                        } else {
                                                            return '0.00%'
                                                        }
                                                    }

                                                }else {
                                                    return '加载中'
                                                }
                                            }(),
                                    value: function () {
                                                if (scope.used != undefined && scope.total) {
                                                    return scope.used
                                                }  else {
                                                    return 0
                                                }

                                            }(),
                                    itemStyle: labelTop
                                },
                                {
                                    name: 'other',
                                    value: function () {
                                                if(scope.total && scope.used && (scope.total - scope.used == 0)){
                                                    return 0;
                                                } else if(scope.total - scope.used > 0) {
                                                    return scope.total - scope.used
                                                } else {
                                                    return 1e-100
                                                }
                                            }(),
                                    itemStyle: labelBottom
                                }
                            ]
                        }
                    ]
                }
            }
            var ndWrapper = elem.find('div')[0];
            ndWrapper.style.width = (scope.radius[1] * 2 || 110) + 'px';
            ndWrapper.style.height = (scope.radius[1] * 2 || 110) + 'px';
            var clusterChart = echarts.init(ndWrapper);
            clusterChart.setOption(createOption());

            scope.$watch(function () {
                return scope.used;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    clusterChart.setOption(createOption());
                }
            }, true);

            scope.$watch(function () {
                return scope.total;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    clusterChart.setOption(createOption());
                }
            }, true);

            scope.$watch(function () {
                return scope.errorCode;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    clusterChart.setOption(createOption());
                }
            }, true);
        }
    }
});

glanceApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

glanceApp.directive('demoDisable', demoDisable);
function demoDisable() {
    return {
        priority: -1,
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            elem.addClass('demo-hide');
            scope.$watch('isDemo', function (value) {
                if (value != undefined) {
                    elem.removeClass('demo-hide');
                    if (value){
                        elem.attr('data-toggle', 'popover');
                        elem.attr('data-trigger', 'focus');
                        elem.attr('tabindex', '-1');
                        elem.attr('data-content', '当前用户为 DEMO 用户，无法使用该功能；请<a href="'+USER_URL+'/user/register">注册</a>数人云账号，使用该功能。');
                        var placement = 'top';
                        if (attrs.demoDisable) {
                            placement = attrs.demoDisable;
                        }
                        elem.attr('data-placement', placement);
                        elem.removeAttr('onclick');
                        elem.attr('href', '#');
                        elem.off('click');
                        elem.unbind('click');
                        elem.bind('click', function (e) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            e.stopPropagation();
                            elem.focus();
                            return false;
                        });
                        elem.popover({html: true,
                            delay: { "hide": 200 },
                            container: 'body'});
                    }
                }
            });
        }
    };
}
