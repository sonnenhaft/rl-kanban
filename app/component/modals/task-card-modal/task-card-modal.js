angular.module('component.modals.task-card-modal', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).factory('openTaskCard', function ($modal) {
    return function (task, settings) {
        return $modal.open({
            windowClass: 'tiny task-card-modal',
            templateUrl: 'app/component/modals/task-card-modal/task-card-modal.html',
            controller: 'TaskCardModalController',
            resolve: {
                task: function () {return task;},
                settings: function () {return settings;}
            }
        }).result;
    };
}).controller('TaskCardModalController', function ($scope, $rootScope, $modalInstance, $location, task, settings) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.task = task;
    $scope.settings = settings;

    $scope.copy = function (task) {
        task.clone();
        $modalInstance.dismiss('cancel');
    };

    $scope.removeCard = function (task) {
        task.remove();
        $rootScope.$broadcast('kanban:task:remove', task.id);

        //close up modal as well
        $modalInstance.dismiss('cancel');
    };

    $scope.openURL = function(task) {
        $rootScope.$broadcast('kanban:openURL',task.resourceId);
    };

});