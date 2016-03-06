(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageCreateCtrl', ImageCreateCtrl);

    ImageCreateCtrl.$inject = ['imageservice'];

    function ImageCreateCtrl(imageservice) {
        var self = this;
        ///
        self.form = {
            uid: 0,
            id: 0,
            parentId: 0,
            name: "",
            repoUri: "",
            triggerType: 0,
            active: true,
            versions: 0,
            autoBuild: 'true',
            tag: true,
            branch: false,
            autoTime: 5
        };

        self.options = [
            {
                name: '5 分钟',
                value: 5
            },
            {
                name: '10 分钟',
                value: 10
            }
        ];

        self.triggerCount = 1;

        self.createProject = function (fromData) {
            console.log(self.form);
            //imageservice.createProject(fromData).then(function (data) {
            //    ////
            //})
        };

        self.triggerCheck = function (checkValue) {
            if (checkValue) {
                self.triggerCount++;
            } else {
                self.triggerCount--;
            }
        };
    }
})();