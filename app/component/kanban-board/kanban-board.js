angular.module('component.kanban-board',[
    'component.kanban-card',
    'component.expand-collapse',
    'component.scrollable-element'
]).directive('kanbanBoard', function ($animate, $location) {
    return {
        templateUrl: 'app/component/kanban-board/kanban-board.html',
        require: '^scrollableElement',
        scope: {
            columns: '=',
            collapse: '=',
            swimlane: '=',
            mode: '='
        },
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
                    var toSwimlane = e.dest.sortableScope.$parent.column.swimlane;
                    var fromSwimlane = e.source.sortableScope.$parent.column.swimlane;
                    task.column = e.dest.sortableScope.$parent.column;
                    task.columnId = task.column.id;
                    task.swimlaneId = task.column.swimlane.id;
                    task.group.recalculate();
                    if (toSwimlane.id !== fromSwimlane.id) {
                        toSwimlane.$tasksCount++;
                        fromSwimlane.$tasksCount--;
                    }
                },
                accept: function (sourceItemHandleScope, destSortableScope) {
                    if ($location.search().template==='planner') {
                        return sourceItemHandleScope.itemScope.sortableScope.$parent.column.swimlane.id === destSortableScope.$parent.column.swimlane.id;
                    } else {
                        return true;
                    }
                }
            };

        }
    };
});