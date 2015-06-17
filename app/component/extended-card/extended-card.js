angular.module('component.extended-card', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).directive('extendedCard', function ($modal) {
    return function ($scope) {
        $scope.open = function (task) {
            return $modal.open({
                windowClass: 'tiny extended-card',
                scope: $scope,
                templateUrl: 'app/component/extended-card/extended-card.html',
                controller: function ($scope, $modalInstance, $location, KanbanTask, task) {
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.task = task;

                    $scope.remove = function(task){
                        task.removeFromGroup();
                        task.removeFromColumn();
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.copy = function(task){
                        task.clone(task);
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.search = $location.search();

                    $scope.tmpl = $scope.search.tmpl || 'planner'
                },
                resolve: {
                    task: function () {
                        return task;
                    }
                }
            });
        };
    };
});