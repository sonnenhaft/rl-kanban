angular.module('kanban').directive('kanban', function () {
    return {
        templateUrl: 'app/kanban.html',
        require: '^scrollableElement',
        scope: {board: '='},
        link: function ($scope, i, j, scrollableElement) {
            $scope.scrollCallbacks = {
                dragStart: scrollableElement.watchMouse,
                dragEnd: scrollableElement.stopWatching,
                containment: '.cards-container',
                scrollableContainer: '.kanban-row'
            };
        }
    };
});
