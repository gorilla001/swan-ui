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

        describe('labeldNode', function() {
            it('should labeld node', function() {
                $scope.selectedLabels = [
                    {name: 'label1',id: 1},
                    {name: 'label2', id: 2}
                ];
                $scope.unselectedLabels = [
                    {name: 'label3', id: 3},
                    {name: 'label4', id: 4}
                ];
                $scope.labeldNode({name: 'label3', id: 3});
                var selectedLabels =  [
                    {name: 'label1', id: 1},
                    {name: 'label2', id: 2},
                    {name: 'label3', id: 3}

                ];
                var unselectedLabels =  [
                    {name: 'label4', id: 4}
                ];
                expect($scope.selectedLabels).toEqual(selectedLabels);
                expect($scope.unselectedLabels).toEqual(unselectedLabels);
                
                $scope.unselectedLabels = [];
                expect($scope.selectedLabels).toEqual(selectedLabels);
                expect($scope.unselectedLabels).toEqual([]);
            });

        });

        describe('tearLabel', function() {
            it('should tear label', function() {
                $scope.selectedLabels = [
                    {name: 'label1',id: 1},
                    {name: 'label2', id: 2}
                ];
                $scope.unselectedLabels = [
                    {name: 'label3', id: 3},
                    {name: 'label4', id: 4}
                ];
                
                $scope.tearLabel({name: 'label1', id: 1});
                
                var selectedLabels = [
                    {name: 'label2', id: 2}
                ];
                var unselectedLabels = [
                    {name: 'label1',id: 1},
                    {name: 'label3', id: 3},
                    {name: 'label4', id: 4}
                ];
                expect($scope.selectedLabels).toEqual(selectedLabels);
                expect($scope.unselectedLabels).toEqual(unselectedLabels);
            });

        });


    });
})();