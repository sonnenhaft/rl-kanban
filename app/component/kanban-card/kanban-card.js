angular.module('component.kanban-card').directive('kanbanCard', function ($location) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope) {
            $scope.remove = function () {
                $scope.task.removeFromGroup();
                $scope.task.removeFromColumn();
            };
            $scope.contentLevel = $location.search().cl || 'low';
            $scope.tmpl = $location.search().tmpl || 'planner'
        }
    };
});