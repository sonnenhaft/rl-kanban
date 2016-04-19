angular.module('component.swim-lane', [
]).directive('swimLane', function () {
    return {
        templateUrl: 'app/component/swim-lane/swim-lane.html',
        scope: {
            swimlane: '=',
            settings: '=',
            groups: '='
        },
        link: function ($scope, $element) {
            $scope.swimlane.collapsed = angular.isDefined($scope.swimlane.collapsed) ? $scope.swimlane.collapsed : false;
            $scope.swimlane.$tasksCount = 0;
            $scope.swimlane.$loading = 0;

            $element.bind('click', function (e) {
                var parent = e.target.parentNode;
                var el = $element[0];
                if (parent === el || parent.parentNode === el) {
                    e.stopPropagation();
                }
            });

            $scope.toggleCollapse = function () {
                $scope.swimlane.collapsed = !$scope.swimlane.collapsed;
            };

            $scope.addResource = function ($event) {
                if ($scope.groups.length) {
                    $scope.$emit('kanban:add-task', $scope.swimlane.id);
                }
                $event.stopPropagation();
            };

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