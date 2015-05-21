angular.module('component.kanban-board',[
    'component.kanban-card',
    'component.scrollable-element'
]).directive('kanbanBoard', function (kanbanService) {
    return {
        templateUrl: 'app/component/kanban-board/kanban-board.html',
        require: '^scrollableElement',
        scope: {columns: '='},
        replace: true,
        link: function ($scope, i, j, scrollableElement) {
            $scope.scrollCallbacks = {
                dragStart: scrollableElement.watchMouse,
                dragEnd: scrollableElement.stopWatching,
                itemMoved: kanbanService.itemMoved,
                containment: '.cards-container',
                scrollableContainer: '.kanban-row'
            };
        }
    };
});