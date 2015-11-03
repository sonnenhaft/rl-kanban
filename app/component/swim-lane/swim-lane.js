angular.module('component.swim-lane', []).directive('swimLane', function () {
    return {
        templateUrl: 'app/component/swim-lane/swim-lane.html',
        scope: {
            swimlane: '=',
            settings: '=',
            groups: '='
        },
        link: function ($scope, $element) {
            $scope.expanded = true;

            $element.bind('click', function(e){
                e.stopPropagation();
            });

            $scope.toggleCollapse = function () {
                $scope.expanded = !$scope.expanded;
            };

            $scope.addResource = function ($event) {
                if ($scope.groups.length) {
                    $scope.$emit('kanban:add-task', $scope.swimlane.id);
                }
                $event.stopPropagation();
            };

            $scope.$watch('swimlane.columns', function (columns) {
                $scope.swimlane.$tasksCount = 0;
                angular.forEach(columns, function (column) {
                    $scope.swimlane.$tasksCount += column.tasks.length;
                });
            });

            $scope.toggleEdit = function ($event, swimlane) {
                $event.stopPropagation();
                if (swimlane.$edit) {
                    swimlane.cancelEdit();
                } else {
                    swimlane.edit();
                }
            };
        }
    };
});