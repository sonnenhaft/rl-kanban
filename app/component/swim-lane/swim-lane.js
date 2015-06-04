angular.module('component.swim-lane',[]).directive('swimLane', function () {
    return {
        templateUrl: 'app/component/swim-lane/swim-lane.html',
        scope: {
            swimlane: '='
        },
        link: function (scope) {
            scope.addTask = function(){
                scope.$evalAsync(function(){
                    var task = angular.copy(scope.swimlane.columns[Math.floor(Math.random() * 2) + 1].tasks[0]);
                    task.id = Math.floor(Math.random() * 100) + 1;
                    scope.swimlane.columns[Math.floor(Math.random() * 5) + 1].tasks.push(task);
                });
            };
        }
    };
});