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
            var defaultRatio = '0.00';
            var diskNames = [];
            var dataInhour = this.getDataInhour(data, frequency, interval);
            var xAxis = dataInhour.xAxis;
            var yAxisDataInhour = dataInhour.yAxis;
            
            var yAxis = calyAxisDataInhour(yAxisDataInhour, frequency, defaultRatio, diskNames);

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

    function calyAxisDataInhour(yAxisDataInhour, frequency, defaultRatio, diskNames) {
        var yAxis = {
            cpu: [],
            memory: [],
            disk: [],
            diskio: [],
            netio: []
        };

        var numbers = calLineNumbers(yAxisDataInhour);
        var defaultyAxis = setDefaultyAxis(numbers, defaultRatio);

        var val;
        for(var i = 0; i < frequency; i++) {
            val = yAxisDataInhour[i];
            yAxis.cpu[i] = val ? setShowRatio(val.cpuPercent, defaultRatio) : defaultyAxis.cpu;
            yAxis.memory[i] = val ? setShowRatio(calRatio(val.memUsed, val.memTotal), defaultRatio) : defaultyAxis.memory;
            yAxis.disk[i] = val ? setShowRatio(calDiskRatio(val, diskNames), defaultRatio): defaultyAxis.disk;
            yAxis.diskio[i] = val ? setShowRatio(calDiskIO(val), defaultRatio): defaultyAxis.diskio;
            yAxis.netio[i] = val ? setShowRatio(calNetIO(val), defaultRatio): defaultyAxis.netio;
        }
        return yAxis;
    }

    function calLineNumbers(yAxisDataInhour) {
        var lastItem = yAxisDataInhour[yAxisDataInhour.length-1];
        var defaultNumber = 1;
        var numbers = {
            cpu: lastItem.cpuPercent.length,
            memory: defaultNumber,
            disk: defaultNumber,
            netio: 2,
            diskio: 2
        };
        numbers.disk = lastItem.disks ? calMaxDiskNumber(yAxisDataInhour) : defaultNumber;
        return numbers;
    }

    function calMaxDiskNumber(yAxisDataInhour) {
        var maxNumber = 0;
        var tempNumber = 0;
        angular.forEach(yAxisDataInhour, function(val, index) {
            tempNumber = val.disks ? val.disks.length : 1;
            maxNumber = (tempNumber > maxNumber) ? tempNumber: maxNumber;
        });
        return maxNumber;
    }

    function setDefaultyAxis(numbers, defaultRatio) {
        var defaultyAxis = {
            cpu: [],
            memory: [],
            disk: [],
            diskio: [],
            netio: []
        };
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

    function calDiskRatio(data, diskNames) {
        var diskPercents = [];

        if (data.disks) {
            angular.forEach(data.disks, function(disk, index) {
                if (diskNames.indexOf(disk.path) === -1) {
                    diskNames.push(disk.path);
                }
                diskPercents[diskNames.indexOf(disk.path)] = calRatio(disk.used, disk.total)[0];
            });
        } else {
            diskPercents = calRatio(data.diskUsed, data.diskTotal);
            diskNames.push('');
        }
        return diskPercents;
    }
    
    function calDiskIO(data) {
        var diskIO = [];
        if (data.ioRate) {
            diskIO.push(data.ioRate.diskReadRate/1024, data.ioRate.diskWriteRate/1024);
        }
        return diskIO;
    }
    
    function calNetIO(data) {
        var netIO = [];
        if (data.ioRate) {
            netIO.push(data.ioRate.netReceiveRate/1024, data.ioRate.netSentRate/1024);
        }
        return netIO;
    }

    function setShowRatio(ratio, defaultRatio) {
        if (!ratio.length) {
            return [defaultRatio];
        }
        angular.forEach(ratio, function(val, index) {
            ratio[index] = val ? Number(val).toFixed(2) : defaultRatio;
        });
        return ratio;
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
        var ioInitialyAxis = [];
        
        for (var i = 0; i < frequency; i ++) {
            data.xAxis[i] = calHourMin(now + i * interval);
            initialyAxis.push(defaultVal);
            ioInitialyAxis.push(['0.00', '0.00'])
        }

        $.each(data.yAxis, function(key, val) {
            data.yAxis[key] = initialyAxis;
        });
        data.yAxis.diskio = ioInitialyAxis;
        data.yAxis.netio = ioInitialyAxis;

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