angular.module('component.kanban-card').directive('kanbanCard', function ($location, extendedCard) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope) {
            $scope.search = $location.search();
            $scope.openTaskCardModal = extendedCard.open;
        }
    };
});