function unitConversion() {
    var convertMem = function(size){
        if (size) {
            size = Math.round(size/1024/1024);
            if (size < 1024) {
                return {num: size, unit: "MB"};
            } else {
                size = (size/1024).toFixed(2)
                return {num: size, unit: "GB"};
            }
        } else {
            return {num: size, unit: null};
        }
    };
    
    var convertDisk = function(size) {
        if (size) {
            size = Math.round(size/1000/1000/1000);
            if (size < 1000) {
                return {num: size, unit: "GB"};
            } else {
                size = (size/1000).toFixed(2);
                if (size < 1000) {
                    return {num: size, unit: "TB"};
                } else {
                    size = (size/1000).toFixed(2)
                    return  {num: size, unit: "PB"};
                }
            }
        } else {
            return {num: size, unit: null};
        }
    };
    
    var convertCpu = function (value) {
        return value;
    };
    
    return {
        convertMem: convertMem,
        convertDisk: convertDisk,
        convertCpu: convertCpu
    }
}

glanceApp.factory('unitConversion', unitConversion);