angular.module('component.kanban-board', [
    'component.kanban-card',
    'component.expand-collapse',
    'component.scrollable-element'
]).directive('kanbanBoard', function ($window, KanbanColumn) {
    return {
        templateUrl: 'app/component/kanban-board/kanban-board.html',
        require: ['^scrollableElement', '^kanban', '^horizontalScroll'],
        scope: {
            swimlane: '=',
            settings: '='
        },
        replace: true,
        link: function ($scope, $element, $attrs, $ctrl) {
            var scrollableElement = $ctrl[0];
            var kanban = $ctrl[1];
            var horizontalScroll = $ctrl[2];

            $scope.limit = 0;
            angular.element($element).ready(function () {
                $scope.$applyAsync(function () {
                    $scope.limit = Infinity;
                });
            });

            $scope.columns = $scope.swimlane.columns;
            $scope.addResources = function () {
                $scope.$emit('kanban:add-task-assessment', $scope.swimlane.id);
            };

            if ($scope.swimlane.isTeam) {
                //just for capability with non team swimlanes
                $scope.column = new KanbanColumn({tasks: [], swimlane: $scope.swimlane});
            }

            var conditions;

            function rememberScrolls() {
                conditions = {
                    scrollTop: $element[0].scrollTop,
                    scrollLeft: horizontalScroll.$element[0].scrollLeft,
                    scrollX: $window.scrollX,
                    scrollY: $window.scrollY
                };
            }

            function rollbackScrolls() {
                if (!conditions) {
                    return;
                }
                $element[0].scrollTop = conditions.scrollTop;
                horizontalScroll.$element[0].scrollLeft = conditions.scrollLeft;
                $window.scrollTo(conditions.scrollX, conditions.scrollY);
            }

            $scope.scrollCallbacks = {
                dragStart: function (e) {
                    rememberScrolls();

                    scrollableElement.watchMouse();
                    var task = e.source.itemScope.task;
                    $scope.$emit('kanban:task:start', task.id);
                    if (angular.isDefined(task.group)) {
                        task.group.$highlightedGroup = true;
                    }
                    if ($scope.settings.highlightTaskOnClick && !task.$highlight) {
                        kanban.highlightTask(task);
                    }
                    if (task.validStates) {
                        kanban.validateStates(task);
                    }
                    if ($scope.settings.editableSwimlanes) {
                        kanban.checkEditableSwimlanes();
                    }
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

                    if (newColumn.$barred && !newColumn.swimlane.isTeam) {
                        e.dest.sortableScope.removeItem(e.dest.index);
                        e.source.itemScope.sortableScope.insertItem(e.source.index, sourceTask);
                        rollbackScrolls();
                    } else {
                        if ($scope.settings.highlightTaskOnClick) {
                            kanban.getHighlighted().forEach(function (task) {
                                task.moveToColumn(newColumn);
                                if (task !== sourceTask) {
                                    var tasks = task.column.tasks;
                                    tasks.splice(tasks.indexOf(task), 1);
                                    tasks.splice(tasks.indexOf(sourceTask) + 1, 0, task);
                                }
                            });
                        } else {
                            sourceTask.moveToColumn(newColumn);
                        }
                        if (newColumn.swimlane.isTeam) {
                            newColumn.tasks = [];
                        }
                    }
                },
                accept: function (sourceSortableScope, destSortableScope) {
                    if (destSortableScope.$parent.swimlane.isTeam) {
                        return true;
                    } else if (destSortableScope.$parent.column.$collapsed) {
                        return false;
                    } else if ($scope.settings.acceptTasks) {
                        return true;
                    } else {
                        return sourceSortableScope.$parent.column.swimlane.id === destSortableScope.$parent.column.swimlane.id;
                    }
                }
            };

        }
    };
});