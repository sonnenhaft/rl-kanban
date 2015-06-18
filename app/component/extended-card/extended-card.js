//TODO: rename to task-card-modal
angular.module('component.extended-card', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
    //TODO: refactor please to service, we don't need to put scope in here.
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

                    $scope.copy = function(task){
                        task.clone(task);
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.removeCard = function(){
                        $scope.remove();
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.search = $location.search();

                    $scope.tmpl = $scope.search.template || 'planner';
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