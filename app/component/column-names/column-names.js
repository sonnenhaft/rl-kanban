angular.module('component.column-names',[
]).directive('columnNames', function(){
    return {
        scope: {columns: '='},
        templateUrl: 'app/component/column-names/column-names.html'
    };
});