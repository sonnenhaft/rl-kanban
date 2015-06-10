angular.module('component.swim-lane',[]).directive('swimLane', function () {
    return {
        templateUrl: 'app/component/swim-lane/swim-lane.html',
        scope: {
            swimlane: '='
        },
        link: function (scope, element, attrs) {
            scope.isCollapsed = false;

            scope.toggleCollapse = function(){
                scope.isCollapsed = !scope.isCollapsed;
            };

            scope.$watch('swimlane.columns', function(columns){
                scope.swimlane.$length = 0;
                angular.forEach(columns, function(column) {
                    scope.swimlane.$length += column.tasks.length;
                });
            });
        }
    };
});