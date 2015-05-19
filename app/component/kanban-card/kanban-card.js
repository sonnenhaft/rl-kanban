angular.module('component.kanban-card').directive('kanbanCard', function (kanbanCardService) {
    return {
        restrict: 'E',
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope) {
            kanbanCardService.registerCard($scope.task.id, $scope);
        }
    };
});