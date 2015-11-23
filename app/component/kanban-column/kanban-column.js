angular.module('component.kanban-column', [
    'component.kanban-card'
]).directive('kanbanColumn', function ($q, $timeout) {
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

            $scope.render = function () {
                var batchSize = 1;
                var computeAndLetUiRender = $q.when();
                var computeNextBatch;

                function computeAndRenderBatch() {
                    $scope.swimlane.$loading = true;
                    $scope.swimlane.$tasksCount += batchSize;
                    $scope.limit += batchSize;
                    return $timeout(angular.noop, 0);
                }

                angular.forEach($scope.column.tasks, function (task) {
                    computeNextBatch = angular.bind(null, computeAndRenderBatch, task);
                    computeAndLetUiRender = computeAndLetUiRender.then(computeNextBatch);
                });

                return computeAndLetUiRender;
            };


            $scope.render().then(function () {
                $scope.limit = Infinity;
                $scope.swimlane.$loading = null;
            });
        }
    };
});