angular.module('component.swim-lane', []).directive('swimLane', function () {
    return {
        templateUrl: 'app/component/swim-lane/swim-lane.html',
        scope: {
            swimlane: '=',
            settings: '=',
            groups: '='
        },
        link: function ($scope) {
            $scope.expanded = true;
            $scope.$edit = false;

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

            $scope.editTasks = function ($event) {
                $event.stopPropagation();
                $scope.$edit = !$scope.$edit;
                if ($scope.$edit) {
                    $scope.swimlane.columns.forEach(function(column){
                        column.tasks.forEach(function(task){
                            $scope.settings.isDisabled = true;
                            task.$edit = true;
                            task.$highlight = undefined;
                        });
                    });
                } else {
                    $scope.swimlane.columns.forEach(function(column){
                        column.tasks.forEach(function(task){
                            $scope.settings.isDisabled = false;
                            delete task.$edit;
                        });
                    });
                }
            }
        }
    };
});