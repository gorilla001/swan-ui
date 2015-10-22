function monitor($rootScope, ngSocket) {
    var wsMonitor = {
        frequency: 60,
        interval: 1 * 60,
        nodesNumber: 180,
        nodes: {},
        times: {},
        initialTimes: function(data, nodeId) {
            if(!this.times[nodeId]) {
                this.times[nodeId] = [];
            }
            if(this.times[nodeId].length === 0) {
                this.times[nodeId][0] = data.timestamp;
                this.times[nodeId][1] = this.times[nodeId][0] + (this.frequency-1) * this.interval;
            }
        },
        updateTimes: function(data) {
            var nodeId = data.nodeId;
            this.initialTimes(data, nodeId);
            var timestamp = data.timestamp;
            if (timestamp > this.times[nodeId][1]) {
                var delta = Math.floor((timestamp - this.times[nodeId][1]) / this.interval);
                this.times[nodeId][0] += delta * this.interval;
                this.times[nodeId][1] += delta * this.interval;
            }
        },
        getxAxisTimes: function(nodeId) {
            var xAxisTimes = {
                seconds: [],
                hourMin: [],
            };

            for (var i = 0; i < this.frequency; i++) {
                xAxisTimes.seconds[i] = this.times[nodeId][0] + i * this.interval;
                xAxisTimes.hourMin[i] =  calHourMin(xAxisTimes.seconds[i]);
            }
            return xAxisTimes;
        },
        getRatios: function(ratios, data, xAxisTimes) {
            var cpuPercent = [];
            $.each(data.cpuPercent, function(index, percent) {
                cpuPercent.push(percent.toFixed(2));
            });

            var timestamp = calHourMin(data.timestamp);
            
            var leftMargin;
            var rightMargin;
            for (var i = 0; i < this.frequency; i++) {
                leftMargin = calHourMin(xAxisTimes.seconds[i]);
                rightMargin = calHourMin(xAxisTimes.seconds[i] + this.interval);
                if(timestamp >= leftMargin && timestamp < rightMargin) {
                    ratios.cpu[i] = cpuPercent;
                    ratios.memory[i] = calRatio(data.memUsed, data.memTotal);
                    ratios.disk[i] = calRatio(data.diskUsed, data.diskTotal);
                    break;
                }
            }

            return ratios;
        },
        updateNodes: function(data) {
            var nodeId = data.nodeId;
            if (!this.nodes[nodeId]) {
                this.nodes[nodeId] = [];
            }
            this.updateTimes(data);
            if (data.timestamp < this.times[nodeId][0] - this.interval) {
                return;
            }
            this.nodes[nodeId].push(data);
            if (this.nodes[nodeId].length > this.nodesNumber) {
                this.nodes[nodeId].shift();
            }
        },
        getChartsData: function(nodeId) {
            if(!this.nodes.hasOwnProperty(nodeId)) {
                return;
            }
            var nodeArray = this.nodes[nodeId];
            xAxisTimes = this.getxAxisTimes(nodeId);
            var ratios = {
                cpu: [],
                memory: [],
                disk: []
            };
            for (var i = 0; i < nodeArray.length; i++) {
                ratios = this.getRatios(ratios, nodeArray[i], xAxisTimes);
            }
            xAxis = xAxisTimes.hourMin;
            yAxis = {
                    cpu: ratios.cpu,
                    memory: ratios.memory,
                    disk: ratios.disk
            };
            
            chartsData = {
                    xAxis: xAxis,
                    yAxis: yAxis
            }
            return chartsData;
        }
    };

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
            var xAxis = this.getDataInhour(data, frequency, interval).xAxis;
            var yAxisDataInhour = this.getDataInhour(data, frequency, interval).yAxis;
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
        wsMonitor: wsMonitor,
        httpMonitor: httpMonitor,
        calHourMin: calHourMin,
        calRatio: calRatio,
        getDefaultData: getDefaultData
    };
};

monitor.$inject = ["$rootScope", "ngSocket"];
glanceApp.factory('monitor', monitor);