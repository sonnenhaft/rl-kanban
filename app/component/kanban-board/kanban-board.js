angular.module('component.kanban-board',[
    'component.kanban-card',
    'component.scrollable-element'
]).directive('kanbanBoard', function () {
    return {
        templateUrl: 'app/component/kanban-board/kanban-board.html',
        require: '^scrollableElement',
        scope: {columns: '='},
        replace: true,
        link: function (scope, element, attrs, scrollableElement) {
            scope.scrollCallbacks = {
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
                    task.column = e.dest.sortableScope.$parent.column;
                    task.columnId = task.column.id;
                    task.swimlaneId = task.column.swimlane.id;
                    task.group.recalculate();
                }
            };
        }
    };
});