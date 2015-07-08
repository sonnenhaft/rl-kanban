angular.module('component.swim-lane',[]).directive('swimLane', function () {
    return {
        templateUrl: 'app/component/swim-lane/swim-lane.html',
        scope: {
            swimlane: '=',
            settings: '=',
            groups: '='
        },
        link: function (scope) {
            scope.expanded = true;

            scope.toggleCollapse = function(){
                scope.expanded = !scope.expanded;
            };

            scope.addResource = function($event) {
                $event.stopPropagation();
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