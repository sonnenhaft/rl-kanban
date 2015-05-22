angular.module('component.kanban-board',[
    'component.kanban-card',
    'component.scrollable-element'
]).directive('kanbanBoard', function () {
    return {
        templateUrl: 'app/component/kanban-board/kanban-board.html',
        require: '^scrollableElement',
        scope: {columns: '='},
        replace: true,
        link: function ($scope, i, j, scrollableElement) {
            $scope.scrollCallbacks = {
                dragStart: function(e){
                    e.source.itemScope.task.group.highlight = true;
                    scrollableElement.watchMouse();
                },
                dragEnd: function(e){
                    e.source.itemScope.task.group.highlight = false;
                    scrollableElement.stopWatching();
                },
                itemMoved: function (e) {
                    var task = e.source.itemScope.task;
                    var toColumn = e.dest.sortableScope.index;
                    task.column = task.columns[toColumn];
                    task.columnId = task.column.id;
                    task.group.recalculate();
                },
                containment: '.cards-container',
                scrollableContainer: '.kanban'
            };
        }
    };
});