angular.module('component.task-card-modal', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).factory('extendedCard', function ($modal) {
    return {
        open: function (task) {
            return $modal.open({
                windowClass: 'tiny task-card-modal',
                templateUrl: 'app/component/task-card-modal/task-card-modal.html',
                controller: function ($scope, $modalInstance, $location, task) {
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.task = task;

                    $scope.copy = function (task) {
                        task.clone(task);
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.removeCard = function () {
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
        }
    }
});