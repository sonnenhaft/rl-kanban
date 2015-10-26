angular.module('component.kanban-board', [
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
            $scope.addResources = function () {
                $scope.$emit('kanban:add-task-assessment', $scope.swimlane.id);
            };
            $scope.scrollCallbacks = {
                dragStart: function (e) {
                    var task = e.source.itemScope.task;
                    $scope.$emit('kanban:task:start', task.id);
                    if (angular.isDefined(task.group)) {
                        task.group.$highlightedGroup = true;
                    }
                    kanban.validateStates();
                    if ($scope.settings.highlightTaskOnClick && !task.$highlight) {
                        kanban.highlightTask(task);
                    }
                    scrollableElement.watchMouse();
                },
                orderChanged: function (e) {
                    var task = e.source.itemScope.task;
                    $scope.$emit('kanban:task:orderchanged', task.id);
                },
                dragEnd: function (e) {
                    var task = e.source.itemScope.task;
                    $scope.$emit('kanban:task:stop', task.id);
                    scrollableElement.stopWatching();
                    if (angular.isArray(task.validStates)) {
                        kanban.clearInvalidStates();
                    }
                },
                itemMoved: function (e) {
                    var newColumn = e.dest.sortableScope.$parent.column;
                    var sourceTask = e.source.itemScope.task;
                    if (newColumn.$barred) {
                        e.dest.sortableScope.removeItem(e.dest.index);
                        e.source.itemScope.sortableScope.insertItem(e.source.index, sourceTask);
                    } else {
                        kanban.getHighlighted().forEach(function (task) {
                            task.moveToColumn(newColumn);

                            if (task !== sourceTask) {
                                var tasks = task.column.tasks;
                                tasks.splice(tasks.indexOf(task), 1);
                                tasks.splice(tasks.indexOf(sourceTask) + 1, 0, task);
                            }
                        });
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