angular.module('component.kanban-board',[
    'component.kanban-card',
    'component.expand-collapse',
    'component.scrollable-element'
]).directive('kanbanBoard', function () {
    return {
        templateUrl: 'app/component/kanban-board/kanban-board.html',
        require: '^scrollableElement',
        scope: {
            collapse: '=',
            columns: '=',
            settings: '=',
            length: '='
        },
        replace: true,
        link: function (scope, element, attrs, scrollableElement) {
            scope.scrollCallbacks = {
                dragStart: function(e){
                    var task = e.source.itemScope.task;
                    scope.$emit('kanban:task:start', task.id);
                    task.group.$highlightedGroup = true;
                    scrollableElement.watchMouse();
                },
                orderChanged: function(e){
                    var task = e.source.itemScope.task;
                    scope.$emit('kanban:task:orderchanged', task.id);
                },
                dragEnd: function(e){
                    var task = e.source.itemScope.task;
                    scope.$emit('kanban:task:stop', task.id);
                    scrollableElement.stopWatching();
                },
                itemMoved: function (e) {
                    var task = e.source.itemScope.task;
                    var toSwimlane = e.dest.sortableScope.$parent.column.swimlane;
                    var fromSwimlane = e.source.sortableScope.$parent.column.swimlane;
                    task.column = e.dest.sortableScope.$parent.column;
                    var oldColumnId  = task.columnId;
                    task.columnId = task.column.id;
                    task.swimlaneId = task.column.swimlane.id;
                    task.group.recalculate();
                    scope.$emit('kanban:task:moved', task.id, oldColumnId, task.columnId);
                    if (toSwimlane.id !== fromSwimlane.id) {
                        toSwimlane.$tasksCount++;
                        fromSwimlane.$tasksCount--;
                    }
                },
                accept: function (sourceSortableScope, destSortableScope) {
                    if (scope.settings.acceptTasks) {
                        return true;
                    } else {
                        return sourceSortableScope.$parent.column.swimlane.id === destSortableScope.$parent.column.swimlane.id;
                    }
                }
            };

        }
    };
});