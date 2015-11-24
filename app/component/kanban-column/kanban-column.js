angular.module('component.kanban-column', [
    'component.kanban-card'
]).directive('kanbanColumn', function ($q, $timeout, $parse) {
    return {
        templateUrl: 'app/component/kanban-column/kanban-column.html',
        scope: {
            column: '=',
            swimlane: '=',
            settings: '=',
            scrollCallbacks: '='
        },
        link: function ($scope, $element, $attrs) {
            $scope.limit = 0;
            $scope.swimlane.$tasksCount += $parse('column.tasks.length')($scope);

            $scope.render = function () {
                var batchSize = 1;
                var computeAndLetUiRender = $q.when();
                var computeNextBatch;
                $scope.swimlane.$loading += 1;

                function computeAndRenderBatch() {
                    $scope.limit += batchSize;
                    return $timeout(angular.noop, 0);
                }

                $scope.column.tasks.forEach(function (task) {
                    computeNextBatch = angular.bind(null, computeAndRenderBatch, task);
                    computeAndLetUiRender = computeAndLetUiRender.then(computeNextBatch);
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