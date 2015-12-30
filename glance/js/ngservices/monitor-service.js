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

            $.each(yAxisDataInhour, function(index, val) {
                if(val) {
                    yAxis.cpu[index] = getDefaultRatio(val.cpuPercent);
                    yAxis.memory[index] = getDefaultRatio(calRatio(val.memUsed, val.memTotal));
                    yAxis.disk[index] = getDefaultRatio(calRatio(val.diskUsed, val.diskTotal));
                }
            });

            chartsData = {
                xAxis: xAxis,
                yAxis: yAxis
            };
            return chartsData;
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

    var calRatio = function(used, total) {
        if (typeof(used) === 'number' && typeof(total) === 'number' && total > 0) {
            return (100 * used / total).toFixed(2);
        }
    };

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

        var initialyAxis = [];
        var now = (new Date()).getTime() / 1000;
        var times = [];
        
        for (var i = 0; i < frequency; i ++) {
            times[i] = now + i * interval;
            initialyAxis.push(0);
        }
        $.each(times, function(index, val) {
            data.xAxis[index] = calHourMin(val);
        });

        $.each(data.yAxis, function(key, val) {
            data.yAxis[key] = initialyAxis;
        });
        return data;
    };

    function getDefaultRatio(ratio) {
        if($.isArray(ratio)) {
            $.each(ratio, function(index, val) {
                if(!val) {
                    ratio[index] = '0.00';
                }
            });
        } else {
            if(!ratio) {
                ratio = '0.00';
            }
        }
        return ratio;
    }
    

    return {
        httpMonitor: httpMonitor,
        calHourMin: calHourMin,
        calRatio: calRatio,
        getDefaultData: getDefaultData
    };
};

monitor.$inject = ["$rootScope", "ngSocket"];
glanceApp.factory('monitor', monitor);