function loading($http) {
    return {
        restrict: 'AEC',
        link: function(scope, elmement, attrs) {
            scope.isLoading = function() {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function(v) {
                if(v) {
                    elmement.show();
                } else {
                    elmement.hide();
                }
            });
        },
        templateUrl: 'views/loading/loading.html',
        replace: true
    }
}


loading.$inject = ['$http'];
glanceApp.directive('loading', loading);