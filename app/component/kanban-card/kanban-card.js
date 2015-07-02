angular.module('component.kanban-card').directive('kanbanCard', function (extendedCard) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope) {
            $scope.openTaskCardModal = extendedCard.open;
        }
    };
});