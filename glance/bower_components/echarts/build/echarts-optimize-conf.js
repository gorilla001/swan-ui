exports.modules = {
    main: {
        name: 'echarts/echarts',
    },
    parts: [
        {name: 'echarts/chart/line', weight: 100},
        {name: 'echarts/chart/bar', weight: 100},
    ]
};

exports.amd = {
    baseUrl: process.cwd(),
    packages: [
        {
            name: 'echarts',
            location: '../src',
            main: 'echarts'
        },
        {
            name: 'zrender',
            location: '../../zrender/src',
            main: 'zrender'
        }
    ]
};