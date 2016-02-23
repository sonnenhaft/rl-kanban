angular.module('component.kanban-column', [
    'component.kanban-card'
]).directive('kanbanColumn', function ($q, $timeout, $parse) {
    return {
        templateUrl: 'app/component/kanban-column/kanban-column.html',
        restrict: 'A',
        scope: {
            column: '=kanbanColumn',
            swimlane: '=',
            settings: '=',
            scrollCallbacks: '='
        },
        link: function ($scope) {
            $scope.limit = 0;
            $scope.swimlane.$tasksCount += $parse('column.tasks.length')($scope);

            $scope.render = function () {
                var batchSize = 1;
                var computeAndLetUiRender = $q.when();
                $scope.swimlane.$loading += 1;

                function computeAndRenderBatch() {
                    $scope.limit += batchSize;
                    return $timeout(angular.noop, 0, false);
                }

                $scope.column.tasks.forEach(function () {
                    computeAndLetUiRender = computeAndLetUiRender.then(computeAndRenderBatch);
                });

                return computeAndLetUiRender;
            };

            var unregister = $scope.$watch('swimlane.collapsed', function (value) {
                if (angular.isDefined(value) && !value) {
                    $scope.render().then(function () {
                        $scope.swimlane.$loading -= 1;
                        $scope.limit = Infinity;
                    });
                    unregister();
                }
            });
        }
    };
});