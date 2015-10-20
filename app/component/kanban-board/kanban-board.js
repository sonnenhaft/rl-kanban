angular.module('component.kanban-board',[
    'component.kanban-card',
    'component.expand-collapse',
    'component.scrollable-element'
]).directive('kanbanBoard', function () {
    return {
        templateUrl: 'app/component/kanban-board/kanban-board.html',
        require: ['^scrollableElement', '^kanban'],
        scope: {
            swimlane: '=',
            settings: '='
        },
        replace: true,
        link: function ($scope, $element, $attrs, $ctrl) {
            var scrollableElement = $ctrl[0];
            var kanban = $ctrl[1];
            $scope.columns = $scope.swimlane.columns;
            $scope.addResources = function(){
               $scope.$emit('kanban:add-task-assessment', $scope.swimlane.id);
            };
            $scope.scrollCallbacks = {
                dragStart: function(e){
                    var task = e.source.itemScope.task;
                    $scope.$emit('kanban:task:start', task.id);
                    if (angular.isDefined(task.group)) {
                        task.group.$highlightedGroup = true;
                    }
                    if (angular.isArray(task.barredColumns)) {
                        task.barredColumns.forEach(function(column) {
                            column.$barred = true;
                        });
                    }
                    if ($scope.settings.highlightTaskOnClick) {
                        kanban.highlightTask(task);
                    }
                    scrollableElement.watchMouse();
                },
                orderChanged: function(e){
                    var task = e.source.itemScope.task;
                    $scope.$emit('kanban:task:orderchanged', task.id);
                },
                dragEnd: function(e){
                    var task = e.source.itemScope.task;
                    $scope.$emit('kanban:task:stop', task.id);
                    scrollableElement.stopWatching();
                    if (angular.isArray(task.barredColumns)) {
                        task.barredColumns.forEach(function(column) {
                            delete column.$barred;
                        })
                    }
                },
                itemMoved: function (e) {
                    if (e.dest.sortableScope.$parent.column.$barred) {
                        e.dest.sortableScope.removeItem(e.dest.index);
                        e.source.itemScope.sortableScope.insertItem(e.source.index, e.source.itemScope.task);
                    } else {
                        var task = e.source.itemScope.task;
                        var toSwimlane = e.dest.sortableScope.$parent.column.swimlane;
                        var fromSwimlane = e.source.sortableScope.$parent.column.swimlane;

                        task.column = e.dest.sortableScope.$parent.column;

                        var oldColumnId  = task.columnId;
                        task.columnId = task.column.id;
                        $scope.$emit('kanban:task:moved', task.id, oldColumnId, task.columnId, fromSwimlane.id, toSwimlane.id);

                        task.swimlaneId = task.column.swimlane.id;
                        if (angular.isDefined(task.group)) {
                            task.group.recalculate();
                        }

                        if (toSwimlane.id !== fromSwimlane.id) {
                            toSwimlane.$tasksCount++;
                            fromSwimlane.$tasksCount--;
                        }
                    }
                },
                accept: function (sourceSortableScope, destSortableScope) {
                    if ($scope.settings.acceptTasks) {
                        return true;
                    } else {
                        return sourceSortableScope.$parent.column.swimlane.id === destSortableScope.$parent.column.swimlane.id;
                    }
                }
            };

        }
    };
});