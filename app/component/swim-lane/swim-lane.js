angular.module('component.swim-lane',[]).directive('swimLane', function () {
    return {
        templateUrl: 'app/component/swim-lane/swim-lane.html',
        scope: {
            swimlane: '='
        },
        link: function (scope) {
            scope.isCollapsed = false;

            scope.toggleCollapse = function(){
                scope.isCollapsed = !scope.isCollapsed;
            };

            scope.$watch('swimlane.columns', function(columns){
                scope.swimlane.$tasksCount = 0;
                angular.forEach(columns, function(column) {
                    scope.swimlane.$tasksCount += column.tasks.length;
                });
            });
        }
    };
});