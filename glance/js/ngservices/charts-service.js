function buildCharts(monitor) {
    function initMarkline() {
        var data = {};
        data = {
            type: 'line',
            data: [],
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: 'white',
                        type: 'solid',
                        width: 0
                    }
                }
            },
            symbolSize: '<2|4>',
            markLine:  {
                data: [
                    {type: 'min', name: '警戒线'}
                ]
            }
        };
        return data;
    }

    function initMarklineData(frequency, alarmingRate) {
        var data = [];
        while(frequency >= 0) {
            data.push(alarmingRate);
            frequency = frequency -1;
        }
        return data;
    }

    function createMarkline(frequency, alarmingRate) {
        var markLine = initMarkline();
        markLine.data = initMarklineData(frequency, alarmingRate);
        return markLine;
    }

    function initCharts(indicator, xAxis, yAxis, alarmingLines) {
        if((!yAxis) || yAxis.length === 0) {
            return;
        }
        var chart = echarts.init(document.getElementById(indicator.domId));
        var option = {
            grid: {
                borderWidth: 0
            },
            title: {
                text: indicator.descriptions.title,
                subtext: indicator.descriptions.subtitle
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                splitLine: {
                    show: false
                },
                data: xAxis
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                },
                splitLine: {
                    show: false
                },
                min: 0,
                max: 100
            }],
            series: []
        };
        var seriesLength;
        var isArray;
        for (var m = 0; m < yAxis.length; m++) {
            if($.isArray(yAxis[m])) {
                isArray = true;
                break;
            }
        }

        if (isArray) {
            var cpuNumber = yAxis[m].length;
            seriesLength = cpuNumber;
            for(var i = 0; i < cpuNumber; i++) {
                option.series[i] = {
                    name: indicator.descriptions.seriesName,
                    type: 'line',
                    data: []
                };

                for(var j = 0; j < yAxis.length; j++) {
                    if(yAxis[j] && yAxis[j][i]) {
                        option.series[i].data.push(yAxis[j][i]);
                    } else {
                        option.series[i].data.push("0.00");
                    }
                }
            }
        } else {
            $.each(yAxis, function(index, val) {
                if (!val) {
                    yAxis[index] = '0.00';
                }
            });
            option.series[0] = {
                name: indicator.descriptions.seriesName,
                type: 'line',
                data: yAxis
            };
            seriesLength = option.series.length;
        }
        option.series[seriesLength] = createMarkline(alarmingLines.frequency, alarmingLines[indicator.key].high);
        option.series[seriesLength+1] = createMarkline(alarmingLines.frequency, alarmingLines[indicator.key].low);
        chart.setOption(option);
    }

    var lineCharts = function(chartsData, DOMs, kind) {
        var cpu = {
            key: "cpu",
            domId: DOMs.cpu,
            descriptions: {
                title: 'CPU监控',
                subtitle: '一小时内变化',
                seriesName: 'CPU使用率'
            }
        };
        var memory = {
            key: "memory",
            domId: DOMs.memory,
            descriptions: {
                title: '内存监控',
                subtitle: '一小时内变化',
                seriesName: '内存使用率'
            }
        };
        var disk = {
            key: "disk",
            domId: DOMs.disk,
            descriptions: {
                title: '磁盘监控',
                subtitle: '一小时内变化',
                seriesName: '磁盘使用率'
            }
        };
        var xAxis;
        var yAxis;
        if (chartsData) {
            xAxis = chartsData.xAxis;
            yAxis = chartsData.yAxis;
        } else {
            var defaultData = monitor.getDefaultData();
            yAxis = defaultData.yAxis;
            xAxis = defaultData.xAxis;
        }

        var alarmingLines = {
            node: {
                frequency: 60,
                cpu: {
                    high: 80,
                    low: 40
                },
                memory: {
                    high: 80,
                    low: 40
                },
                disk: {
                    high: 80,
                    low: 40
                }
            },
            cluster: {
                frequency: 60,
                cpu: {
                    high: 80,
                    low: 40
                },
                memory: {
                    high: 80,
                    low: 40
                },
                disk: {
                    high: 80,
                    low: 40
                }
            }
        };

        initCharts(memory, xAxis, yAxis.memory, alarmingLines[kind]);
        initCharts(disk, xAxis, yAxis.disk, alarmingLines[kind]);
        initCharts(cpu, xAxis, yAxis.cpu, alarmingLines[kind]);
    };

    return {
        lineCharts: lineCharts
    };
}

buildCharts.$inject = ["monitor"];
glanceApp.factory('buildCharts', buildCharts);