angular.module('component.kanban-card').directive('kanbanCard', function (kanbanCardService, $rootScope) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope) {
            kanbanCardService.registerCard($scope.task.id, $scope);

            $scope.remove = function () {
                //TODO: replace with something else
                $rootScope.$broadcast('group-removed', $scope.task);
                $scope.removeItem($scope.index());
            };
        }
    };
});