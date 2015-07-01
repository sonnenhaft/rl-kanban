angular.module('component.add-new-control', []).directive('addNewControl', function(){
    return {
        templateUrl: 'app/component/add-new-control/add-new-control.html',
        scope: true,
        link: function($scope){
            $scope.addTask = function(){
                $scope.$emit('addTask');
            };

            $scope.addGroup = function(){
                $scope.$emit('addGroup');
            };
        }
    };
});