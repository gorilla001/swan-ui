(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('WarningEventCtrl', WarningEventCtrl);

    /* @ngInject */
    function WarningEventCtrl() {
        var self = this;

        self.totalItems = 64;
        self.currentPage = 1;
        self.setPage = setPage;
        self.pageChanged = pageChanged;
        self.getTaskEvent = getTaskEvent;

        function setPage(pageNo) {
            self.currentPage = pageNo;
        }

        function pageChanged() {
            console.log(self.currentPage);
        }

        function getTaskEvent(){
            console.log(111)
        }
    }
})();