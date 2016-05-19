function buildCharts(monitor) {
    function initMarkline(color) {
        var data = {};
        data = {
            type: 'line',
            data: [],
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: color,
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            symbolSize: '<2|4>'
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

    function createMarkline(frequency, alarmingRate, color) {
        var markLine = initMarkline(color);
        markLine.data = initMarklineData(frequency, alarmingRate);
        return markLine;
    }

    function setBasicStyle(color, postfix, max) {
        var option = {
            grid: {},
            xAxis: [],
            yAxis: [],
            animation: false
        };
        option.grid.borderWidth = 0;
        option.xAxis[0] = {
            type: 'category',
            boundaryGap: false,
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: color
                }
            }
        };
        option.yAxis[0] = {
            type: 'value',
            axisLabel: {
                formatter: '{value}' + postfix
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: color
                }
            },
            min: 0,
            max: max
        };
        return option;
    }

    function setBasicInfo(descriptions, postfix) {
        var option = {
            title: {
                text: descriptions.title,
                subtext: descriptions.subtitle
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params){
                    var res = '';
                    for (var i = 0, l = params.length; i < l; i++) {
                        var dataStr;
                        if (params[i].data != undefined) {
                            dataStr = params[i].data + postfix;
                        } else {
                            dataStr = "无数据";
                        }
                        if (params[i].seriesName !== '') {
                            res += params[i].seriesName + '：' + dataStr + '<br/>';
                        }
                    }
                    return res;
                }
            }
        };
        return option;
    }

    function setSeriesStyles(indicator, i) {
        var name;
        if ($.isArray(indicator.descriptions.seriesName)) {
            name = indicator.descriptions.seriesName[i];
        } else {
            name = indicator.descriptions.seriesName;
        }
        var seriesStyle = {
            name: name,
            type: 'line',
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: indicator.styles.lineWidth
                    }
                }
            },
            symbolSize: '<2|4>'
        };
        if (indicator.styles.lineColor) {
            seriesStyle.itemStyle.normal.lineStyle.color = indicator.styles.lineColor;
        }
        return seriesStyle;
    }

    function getSeriesData(yAxis) {
        var seriesData = [];
        angular.forEach(yAxis, function(percentArray, percentArrayIndex) {
            angular.forEach(percentArray, function(percent, percentIndex) {
                if(!seriesData[percentIndex]) {
                    seriesData[percentIndex] = [];
                }
                seriesData[percentIndex].push(percentArray[percentIndex]);
            });
        });
        return seriesData;
    }

    function getChatrsOption(indicator, xAxis, yAxis, postfix, max, alarmingLines) {
        var option = {};
        option.series = [];
        var basicStyle = setBasicStyle(indicator.styles.axesColor, postfix, max);
        basicStyle.xAxis[0].data = xAxis;
        var basicInfo = setBasicInfo(indicator.descriptions, postfix);
        
        var keys = [basicStyle, basicInfo];
        $.each(keys, function(index, obj) {
            $.each(obj, function(key, value) {
                option[key] = value;
            });
        });

        var seriesData = getSeriesData(yAxis);
        var lineNumber = yAxis[yAxis.length-1].length;
        for(var i = 0; i < lineNumber; i++) {
            option.series[i] = setSeriesStyles(indicator, i);
            option.series[i].data = seriesData[i];
        }
        if (alarmingLines) {
            option.series[lineNumber] = createMarkline(alarmingLines.frequency, alarmingLines.high.rate, alarmingLines.high.color);
            option.series[lineNumber+1] = createMarkline(alarmingLines.frequency, alarmingLines.low.rate, alarmingLines.low.color);
        }
        return option;
    }

    function initCharts(indicator, xAxis, yAxis, alarmingLines) {
        var option = getChatrsOption(indicator, xAxis, yAxis, "%", 100, alarmingLines);
        var chart = echarts.init(document.getElementById(indicator.domId));
        chart.setOption(option);
    }
    
    function initIOCharts(indicator, xAxis, yAxis) {
        var option = getChatrsOption(indicator, xAxis, yAxis, "", getYAxisMax(yAxis));
        var chart = echarts.init(document.getElementById(indicator.domId));
        chart.setOption(option);
    }
    
    function getYAxisMax(yAxis){
        var max = 0;
        angular.forEach(yAxis, function (item) {
            angular.forEach(item, function (value) {
                if (Number(value) > Number(max)) {
                    max = Number(value).toFixed(0);
                }
            })
        });
        if (max < 0.1) {
            max = 0.1;
        }
        return max;
    }
    
    function listDiskNames(diskNames) {
        var names = [];
        for (var i = 0; i < diskNames.length; i++) {
            names[i] = diskNames[i] + '使用率';
        }
        return names;
    }

    var lineCharts = function(chartsData, DOMs) {
        var cpu = {
            key: 'cpu',
            domId: DOMs.cpu,
            descriptions: {
                title: 'CPU监控',
                subtitle: '一小时内变化',
                seriesName: 'CPU使用率'
            },
            styles: {
                lineWidth: 3,
                axesColor: '#9B9B9B',
                axiesFontsize: '11px'
            }
        };
        var memory = {
            key: 'memory',
            domId: DOMs.memory,
            descriptions: {
                title: '内存监控',
                subtitle: '一小时内变化',
                seriesName: '内存使用率'
            },
            styles: {
                lineColor: '#68d1f2',
                lineWidth: 3,
                axesColor: '#9B9B9B',
                axiesFontsize: '11px'
            }
        };
        var disk = {
            key: 'disk',
            domId: DOMs.disk,
            descriptions: {
                title: '磁盘监控',
                subtitle: '一小时内变化',
                seriesName: listDiskNames(chartsData.diskNames)
            },
            styles: {
                lineWidth: 3,
                axesColor: '#9B9B9B',
                axiesFontsize: '11px'
            }
        };
        var diskio = {
                key: 'diskio',
                domId: DOMs.diskio,
                descriptions: {
                    title: '磁盘I/O监控',
                    subtitle: '一小时内变化 (KB/s)',
                    seriesName: ['磁盘读速率', '磁盘写速率']
                },
                styles: {
                    lineWidth: 3,
                    axesColor: '#9B9B9B',
                    axiesFontsize: '11px'
                }
            };
        var netio = {
                key: 'netio',
                domId: DOMs.netio,
                descriptions: {
                    title: '网络I/O监控',
                    subtitle: '一小时内变化 (KB/s)',
                    seriesName: ['网络接收速率','网络发送速率']
                },
                styles: {
                    lineWidth: 3,
                    axesColor: '#9B9B9B',
                    axiesFontsize: '11px'
                }
            };
        
        var xAxis = chartsData.xAxis;
        var yAxis = chartsData.yAxis;

        var cpuNumber = 1;
        if ($.isArray(yAxis.cpu[0])) {
            cpuNumber = yAxis.cpu[0].length;
        }

        var alarmingLines = {
            frequency: 60,
            high: {
                rate: 80,
                color: 'rgba(208, 2, 27, 0.5)'
            },
            low: {
                rate: 40,
                color: 'rgba(245, 166, 35, 0.5)'
            }
        };

        initCharts(memory, xAxis, yAxis.memory, alarmingLines);
        initCharts(disk, xAxis, yAxis.disk, alarmingLines);
        initCharts(cpu, xAxis, yAxis.cpu, alarmingLines);
        initIOCharts(diskio, xAxis, yAxis.diskio);
        initIOCharts(netio, xAxis, yAxis.netio);
    };

    return {
        lineCharts: lineCharts,
        initIOCharts: initIOCharts
    };
}

buildCharts.$inject = ["monitor"];
glanceApp.factory('buildCharts', buildCharts);
