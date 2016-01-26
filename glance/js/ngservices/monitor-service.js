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
            if(!data || !data.length) {
                return setDefaultChartsData();
            }

            var frequency = 60;
            var interval = 1 * 60;
            var dataInhour = this.getDataInhour(data, frequency, interval);
            var xAxis = dataInhour.xAxis;
            var yAxisDataInhour = dataInhour.yAxis;
            
            var diskNames = setDiskNames(yAxisDataInhour[yAxisDataInhour.length-1].disks);
            var yAxis = calyAxisDataInhour(yAxisDataInhour, frequency);

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

    ///////////

    function calyAxisDataInhour(yAxisDataInhour, frequency) {
        var yAxis = {
            cpu: [],
            memory: [],
            disk: []
        };

        var numbers = calLineNumbers(yAxisDataInhour[yAxisDataInhour.length-1]);
        var defaultyAxis = setDefaultyAxis(numbers);

        var val;
        for(var i = 0; i < frequency; i++) {
            val = yAxisDataInhour[i];
            yAxis.cpu[i] = val ? setShowRatio(val.cpuPercent) : defaultyAxis.cpu;
            yAxis.memory[i] = val ? setShowRatio(calRatio(val.memUsed, val.memTotal)) : defaultyAxis.memory;
            yAxis.disk[i] = val ? setShowRatio(calDiskPercent(val)): defaultyAxis.disk;
        }
        return yAxis;
    }

    function calLineNumbers(lastItem) {
        var defaultNumber = 1;
        var numbers = {
            cpu: lastItem.cpuPercent.length,
            memory: defaultNumber,
            disk: defaultNumber
        };
        numbers.disk = lastItem.disks ? lastItem.disks.length : defaultNumber;
        return numbers;
    }

    function setDefaultyAxis(numbers) {
        var defaultyAxis = {
            cpu: [],
            memory: [],
            disk: []
        };
        var defaultRatio = '0.00';
        angular.forEach(numbers, function(val, key) {
            for(var i = 0; i < val; i++) {
                defaultyAxis[key][i] = defaultRatio;
            }
        });
        return defaultyAxis;
    }

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

    function setShowRatio(ratio) {
        var defaultRatio = '0.00';
        if (!ratio.length) {
            return [defaultRatio];
        }
        angular.forEach(ratio, function(val, index) {
            ratio[index] = val ? Number(val).toFixed(2) : defaultRatio;
        });
        return ratio;
    }

    function setDiskNames(disks) {
        var diskNames = [];
        if(!disks) {
            diskNames.push('');
        } else {
            angular.forEach(disks, function(val, index) {
                diskNames.push(val.path);
            });
        }
        return diskNames;
    }

    var setDefaultChartsData = function() {
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
        calHourMin: calHourMin
    };
};

monitor.$inject = ["$rootScope", "ngSocket"];
glanceApp.factory('monitor', monitor);