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
            var regex = /([A-z\d\?\,\.\:\;\'\"\!\(\)])*[A-Z]/;
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
            names: '=nameList'
        },
        link: function (scope, ele, attrs, ngModelController) {
            ngModelController.$validators.samename = function(modelValue, viewValue) {
                if (ngModelController.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }

                if (scope.names.indexOf(modelValue) == -1) {
                    // it is valid
                    return true;
                }

                // it is invalid
                return false;
            };
        }
    };
});

glanceApp.directive('pirChart', function() {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope:{
            cpuUsed: '=cpuUsed',
            cpuTotal: '=cpuTotal',
            memUsed: '=memUsed',
            memTotal: '=memTotal'
        },
        link: function(scope, elem, attrs, ctrl) {
            var labelCpuTop = {
                normal: {
                    color: '#68d1f2',
                    label: {
                        show: true,
                        position: 'center',
                        formatter: '{d}'+'%',
                        textStyle: {
                            fontSize: 17,
                            baseline: 'bottom'
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }
            };
            var labelMemTop = {
                normal: {
                    color: '#ff9494',
                    label: {
                        show: true,
                        position: 'center',
                        formatter: '{d}'+'%',
                        textStyle: {
                            fontSize: 17,
                            baseline: 'bottom'
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
            var labelCpuBottom = {
                normal: {
                    color: '#eee',
                    label: {
                        show: true,
                        position: 'center',
                        formatter: 'CPU 占用',
                        textStyle: {
                            fontSize: 7
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }
            };
            var labelMemBottom = {
                normal: {
                    color: '#eee',
                    label: {
                        show: true,
                        position: 'center',
                        formatter: '内存占用',
                        textStyle: {
                            fontSize: 7
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }
            };
            var radius = [45, 55];
            var option = {
                series: [
                    {
                        type: 'pie',
                        center: ['30%', '30%'],
                        radius: radius,
                        itemStyle: labelFromatter,
                        data: [
                            {name: 'CPU占用', value: scope.cpuUsed, itemStyle: labelCpuTop},
                            {name: 'other', value: scope.cpuTotal-scope.cpuUsed, itemStyle: labelCpuBottom}
                        ]
                    },
                    {
                        type: 'pie',
                        center: ['30%', '80%'],
                        radius: radius,
                        itemStyle: labelFromatter,
                        data: [
                            {name: '内存占用', value: scope.memUsed, itemStyle: labelMemTop},
                            {name: 'other', value: scope.memTotal-scope.memUsed, itemStyle: labelMemBottom}
                        ]
                    }
                ]
            };

            var ndWrapper  = elem.find('div')[0];
            ndWrapper.style.width = 200 + 'px';
            ndWrapper.style.height = 300 + 'px';
            var clusterChart = echarts.init(ndWrapper);
            clusterChart.setOption(option);
        }
    };
});