function unitConversion() {
    var convertMem = function(size){
        if (size) {
            size = Math.round(size/1024/1024);
            if (size < 1024) {
                return size + "MB";
            } else {
                return (size/1024).toFixed(2) + "GB";
            }
        } else {
            return size;
        }
    };
    
    var convertDisk = function(size) {
        if (size) {
            size = Math.round(size/1000/1000/1000);
            if (size < 1000) {
                return size + "GB";
            } else {
                size = (size/1000).toFixed(2);
                if (size < 1000) {
                    return size + "TB";
                } else {
                    return (size/1000).toFixed(2) + "PB";
                }
            }
        } else {
            return size;
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