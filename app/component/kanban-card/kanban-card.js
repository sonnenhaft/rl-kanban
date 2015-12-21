angular.module('component.kanban-card').directive('kanbanCard', function ($timeout, $rootScope, $parse,
                                                                          openTaskCard, openConfirmationModal, kanbanCardFields, isTouch, fixIE9) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        require: '^kanban',
        link: function ($scope, $element, $attrs, kanban) {
            //TODO: move settings to same level where tasks object lays
            var parentSettings = $scope.$parent.settings || $scope.settings;
            $scope.fields = angular.extend(angular.copy(kanbanCardFields), parentSettings.tasksDisplayFields);

            var higlightedTasks = null;
            function catchEsc() {
                higlightedTasks.forEach(function(task){
                    task.$highlight = true;
                    task.$skipEsc = true;
                    $timeout(function () {
                        if (task.$skipEsc) {task.$skipEsc = false;}
                    }, 1000, false);
                });
                higlightedTasks = null;
            }

            function rememberHighligted(){
                higlightedTasks = kanban.getHighlighted();
            }

            $scope.clickCallbacks = function (task, settings, $event, force) {
                fixIE9('unselect-text');
                $event.stopPropagation();
                if (!task.$edit && settings.highlightTaskOnClick) {
                    if (!settings.enableMultiSelect) {
                        kanban.highlightTask(task);
                    } else if ($event.ctrlKey || $event.metaKey) {
                        task.$highlight = !task.$highlight;
                        return;
                    } else if (!task.$highlight) {
                        kanban.highlightTask(task);
                    }
                }

                if (settings.legacyCardModal && !force) {
                    $scope.$emit('kanban:task:modalopen', task);
                    task.$skipEsc = true;
                } else if (!task.$edit) {
                    rememberHighligted();
                    openTaskCard(task, settings).then(angular.noop, catchEsc);
                }
            };

            $scope.limit = 50;

            $scope.showFullDescription = function (task, settings, $event) {
                if (task.$edit) { return; }
                $event.stopPropagation();
                $scope.limit = task.notes.length;
                if (settings.highlightTaskOnClick) {
                    kanban.highlightTask(task);
                }
            };

            $scope.deleteTask = function ($event, task) {
                $event.stopPropagation();
                rememberHighligted();
                openConfirmationModal($scope).then(function () {
                    catchEsc();
                    task.remove();
                    $rootScope.$broadcast('kanban:task:remove', task.id);
                }, catchEsc);
            };

            $scope.groupColor = $parse('group.color')($scope.task) || null;

            var wrapper = $element.children();
            var borderColor = $scope.groupColor || '#326295';
            $scope.$watch('task.$highlight', function (value) {
                if (value) {
                    wrapper.addClass('card-highlight');
                    wrapper.css('borderColor', borderColor);
                } else {
                    wrapper.removeClass('card-highlight');
                    wrapper.css('borderColor', 'transparent');
                }
            });

            if (isTouch) {
                var swimlane = $scope.task.column.swimlane;

                if (!swimlane.$disabled) {
                    swimlane.$disabled = true;
                }

                var timeout = null;
                $element.on('touchstart', function () {
                    timeout = $timeout(function () {
                        swimlane.$disabled = false;
                    }, 500);
                }).on('touchend', function () {
                    swimlane.$disabled = true;
                    $timeout.cancel(timeout);
                });

                var cardHandle = angular.element($element[0].getElementsByClassName('card-handle'));
                cardHandle.on('touchstart', function () {
                    swimlane.$disabled = false;
                    $scope.$apply();
                }).on('touchend', function () {
                    swimlane.$disabled = true;
                    $scope.$apply();
                });

                $scope.$on('$destroy', function () {
                    cardHandle.off();
                });
            }
        }
    };
}).directive('ngLazyClick', function ($parse) {
    return {
        compile: function ($element, $attr) {
            var fn = $parse($attr.ngLazyClick);
            return function ($scope, $element) {
                $element.on('click', function ($event) {
                    $scope.$apply(function () {
                        fn($scope, {$event: $event});
                    });
                });

                $scope.$on('$destroy', function () {
                    $element.off();
                });
            };
        }
    };
});
