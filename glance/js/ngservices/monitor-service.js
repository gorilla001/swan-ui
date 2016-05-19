function monitor($rootScope, ngSocket) {
    var httpMonitor = {
        getxAxisTimes: function(timestamp, frequency, interval) {
            var times = {
                seconds: [],
                hourMin: []
            };
            for (var i = 0; i < frequency; i++) {
                times.seconds[i] = timestamp - (frequency - i - 1) * interval;
                times.hourMin[i] = calHourMin(times.seconds[i]);
            }
            return times;
        },

        getDataInhour: function(data, frequency, interval, getTimestampFn) {
            if (!getTimestampFn) {
                getTimestampFn = function (data) {
                    return data.timestamp;
                };
            }
            var dataInhour = {};
            var timestamp = Math.floor(getTimestampFn(data[0])/60)*60
            var xAxisTimes = this.getxAxisTimes(timestamp, frequency, interval);
            var yAxisInhour = [];
            for(var i = 0; i < frequency; i++) {
                var cur_interval = interval/2 + 1;
                
                for (var j = 0; j < data.length; j++) {
                    var temp_interval = Math.abs(getTimestampFn(data[j]) - xAxisTimes.seconds[i])
                    if(temp_interval < cur_interval) {
                        yAxisInhour[i] = data[j];
                        cur_interval = temp_interval;
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
            var diskNames = [];
            var dataInhour = this.getDataInhour(data, frequency, interval);
            var xAxis = dataInhour.xAxis;
            var yAxisDataInhour = dataInhour.yAxis;
            
            var yAxis = calyAxisDataInhour(yAxisDataInhour, frequency, diskNames);

            return {
                xAxis: xAxis,
                yAxis: yAxis,
                diskNames: diskNames
            };
        },
        
        setShowRatio: setShowRatio
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

    function calyAxisDataInhour(yAxisDataInhour, frequency, diskNames) {
        var yAxis = {
            cpu: [],
            memory: [],
            disk: [],
            diskio: [],
            netio: []
        };

        var numbers = calLineNumbers(yAxisDataInhour);
        var val;
        for(var i = 0; i < frequency; i++) {
            val = yAxisDataInhour[i];
            if (!val) {
                yAxis.cpu[i] = setShowRatio([], numbers.cpu);
                yAxis.memory[i] = setShowRatio([], numbers.memory);
                yAxis.disk[i] = setShowRatio([], numbers.disk);
                yAxis.diskio[i] = setShowRatio([], numbers.diskio);
                yAxis.netio[i] = setShowRatio([], numbers.netio);
            } else {
                yAxis.cpu[i] = setShowRatio(val.cpuPercent, numbers.cpu);
                yAxis.memory[i] = setShowRatio(calRatio(val.memUsed, val.memTotal), numbers.memory);
                yAxis.disk[i] = setShowRatio(calDiskRatio(val, diskNames), numbers.disk);
                yAxis.diskio[i] = setShowRatio(calDiskIO(val), numbers.diskio);
                yAxis.netio[i] = setShowRatio(calNetIO(val), numbers.netio);
            }
        }
        return yAxis;
    }

    function calLineNumbers(yAxisDataInhour) {
        var numbers = {
            memory: 1,
            netio: 2,
            diskio: 2
        };
        numbers.cpu = calMaxNumber(yAxisDataInhour, 'cpuPercent');
        numbers.disk = calMaxNumber(yAxisDataInhour, 'disks');
        return numbers;
    }

    function calMaxNumber(yAxisDataInhour, name) {
        var maxNumber = 0;
        var tempNumber = 0;
        angular.forEach(yAxisDataInhour, function(val, index) {
            tempNumber = val[name] ? val[name].length : 0;
            maxNumber = (tempNumber > maxNumber) ? tempNumber: maxNumber;
        });
        return maxNumber;
    }

    function calRatio(used, total) {
        var ratio = [];
        if (typeof(used) === 'number' && typeof(total) === 'number' && total > 0) {
            ratio[0] = (100 * used / total);
        } else {
            ratio[0] = undefined;
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

    function setShowRatio(ratio, lineNum) {
        if (!ratio) {
            ratio = [];
        }
        angular.forEach(ratio, function(val, index) {
            if (val) {
                ratio[index] = Number(val).toFixed(2);
            } else {
                ratio[index] = val;
            }
        });
        for (var i=0; i<lineNum; i++) {
            if (ratio[i] == undefined) {
                ratio[i] = undefined;
            }
        }
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
        
        var now = (new Date()).getTime() / 1000;
        var initialyAxis = [];
        var ioInitialyAxis = [];
        
        for (var i = 0; i < frequency; i ++) {
            data.xAxis[i] = calHourMin(now + i * interval);
            initialyAxis.push([undefined]);
            ioInitialyAxis.push([undefined, undefined])
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