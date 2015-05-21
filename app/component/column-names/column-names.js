angular.module('component.column-names',[
]).directive('columnNames', function(){
    return {
        scope: {columns: '='},
        replace: true,
        templateUrl: 'app/component/column-names/column-names.html',
        link: function($scope, $element) {
            $scope.$watch('columns.length', function(length){
                $element.css('width', length * 300 + 'px');
            });
        }
    };
});