angular.module('component.kanban-card', [
    'angularMoment',
    'component.glyph-icon'
]).directive('kanbanCard', function (kanbanCardService) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope) {
            kanbanCardService.registerCard($scope.card.id, $scope);
        }
    };
});