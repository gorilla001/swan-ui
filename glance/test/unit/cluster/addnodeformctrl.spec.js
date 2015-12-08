(function () {
    'use strict';
    describe('addNodeFromCtrl', function() {
        beforeEach(module('glance'));
        var $scope, $controller;
        beforeEach(inject(function(_$rootScope_, _$controller_) {
            $scope = _$rootScope_.$new();
            $controller = _$controller_;
            $controller('addNodeFormCtrl', {$scope: $scope});
        }));

        describe('buildFromSelectedLabels', function() {

            it('should add labels to form', function() {
                $scope.form = {};
                $scope.form.labels = [];
                $scope.allLabels = [
                    {
                        name: 'label1',
                        id: 1
                    },
                    {
                        name: 'label2',
                        id: 2
                    },
                    {
                        name: 'label3',
                        id: 3
                    },
                    {
                        name: 'label4',
                        id: 4
                    }
                ];
                
                $scope.toggleLabel2Node(1);
                expect($scope.form.labels).toEqual([1]);
                $scope.toggleLabel2Node(1);
                expect($scope.form.labels).toEqual([]);
            });

        });


    });
})();