angular.module('component.kanban-card').directive('kanbanCard', function () {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope) {
            $scope.remove = function () {
                $scope.task.removeFromGroup();
                $scope.task.removeFromColumn();
            };
        }
    };
});