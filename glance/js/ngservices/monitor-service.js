function monitor($rootScope, ngSocket) {
    var httpMonitor = {
        getxAxisTimes: function(timestamp, frequency, interval) {
            var times = {
                seconds: [],
                hourMin: []
            };
            for (var i = 0; i < frequency; i++) {
                times.seconds[i] = timestamp - (frequency - i - 1) * interval;
                times.hourMin[i] = calHourMin(timestamp - (frequency - i - 1) * interval);
            }
            return times;
        },

        getDataInhour: function(data, frequency, interval) {
            var dataInhour = {};
            var xAxisTimes = this.getxAxisTimes(data[0].timestamp, frequency, interval);
            var yAxisInhour = [];
            var leftMargin, rightMargin;
            for(var i = 0; i < frequency; i++) {
                leftMargin = xAxisTimes.hourMin[i];
                rightMargin = calHourMin(xAxisTimes.seconds[i] + interval);
                
                for (var j = 0; j < data.length; j++) {
                    timestamp = calHourMin(data[j].timestamp);
                    if(timestamp >= leftMargin && timestamp < rightMargin && !yAxisInhour[i]) {
                        yAxisInhour[i] = data[j];
                        break;
                    }
                }
            }
            dataInhour.xAxis = xAxisTimes.hourMin;
            dataInhour.yAxis = yAxisInhour;
            return dataInhour;
        },
        
        getChartsData: function(data) {
            var chartsData = {};
            if(!data || !data.length) {
                chartsData = getDefaultData();
                return chartsData;
            }

            var frequency = 60;
            var interval = 1 * 60;
            var dataInhour = this.getDataInhour(data, frequency, interval);

            var xAxis = dataInhour.xAxis;
            var yAxisDataInhour = dataInhour.yAxis;
            var yAxis = {
                cpu: [],
                memory: [],
                disk: []
            };

            var diskNames = [];
            $.each(yAxisDataInhour, function(index, val) {
                if(val) {
                    yAxis.cpu[index] = setDefaultRatio2NaN(val.cpuPercent);
                    yAxis.memory[index] = setDefaultRatio2NaN(calRatio(val.memUsed, val.memTotal));
                    //兼容老版本的格式
                    yAxis.disk[index] = setDefaultRatio2NaN(calDiskPercent(val));
                    diskNames = setDiskNames(val.disks, diskNames);
                }
            });

            return {
                xAxis: xAxis,
                yAxis: yAxis,
                diskNames: diskNames
            };
        }

    };

    var calHourMin = function(seconds) {
        var milliSeconds = seconds * 1000;
        var d = new Date();
        d.setTime(milliSeconds);
        var hour = d.getHours();
        var min = d.getMinutes();
        if (hour < 10) {
            hour = '0' + hour;
        }
        if(min < 10) {
            min = '0' + min;
        }
        return hour + ':' + min;
    };

    function calRatio(used, total) {
        var ratio = [];
        if (typeof(used) === 'number' && typeof(total) === 'number' && total > 0) {
            ratio[0] = (100 * used / total);
        }
        return ratio;
    }

    function calDiskPercent(data) {
        var diskPercents = [];
        var disks = data.disks;
        if (disks) {
            angular.forEach(disks, function(val, index) {
                diskPercents.push(calRatio(val.used, val.total)[0]);
            });
        } else {
            diskPercents = calRatio(data.diskUsed, data.diskTotal);
        }
        return diskPercents;
    }

    function setDefaultRatio2NaN(ratio) {
        var defaultRatio = '0.00';
        if (!ratio.length) {
            return [defaultRatio];
        }
        angular.forEach(ratio, function(val, index) {
            if(val) {
                ratio[index] = Number(val).toFixed(2);
            } else {
                ratio[index] = defaultRatio;
            }
        });
        return ratio;
    }

    function setDiskNames(disks, diskNames) {
        if(!disks) {
            diskNames = [''];
        } else if (disks && (diskNames.length <= 1)) {
            angular.forEach(disks, function(val, index) {
                diskNames.push(val.path);
            });
        }
        return diskNames;
    }

    var getDefaultData = function() {
        var data = {
            yAxis: {
                memory: [],
                disk: [],
                cpu: []
            },
            xAxis: []
        };
        var frequency = 60;
        var interval = 1 * 60;
        var defaultVal = ['0.00'];
        
        var now = (new Date()).getTime() / 1000;
        var initialyAxis = [];
        
        for (var i = 0; i < frequency; i ++) {
            data.xAxis[i] = calHourMin(now + i * interval);
            initialyAxis.push(defaultVal);
        }

        $.each(data.yAxis, function(key, val) {
            data.yAxis[key] = initialyAxis;
        });

        data.diskNames = [''];
        return data;
    };

    return {
        httpMonitor: httpMonitor,
        calHourMin: calHourMin,
        getDefaultData: getDefaultData
    };
};

monitor.$inject = ["$rootScope", "ngSocket"];
glanceApp.factory('monitor', monitor);