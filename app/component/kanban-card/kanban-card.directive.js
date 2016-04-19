angular.module('component.kanban-card', [
    'component.glyph-icon',
    'component.modals.task-card-modal',
    'component.modals.confirmation-modal',
    'component.is-touch',
    'component.tool-tip',
    'component.sanitize-filter',
    'ie-9-fixes'
]).directive('kanbanCard', function ($timeout, $rootScope, $parse,
                                                                          openTaskCard, openConfirmationModal, kanbanCardFields, isTouch, fixIE9) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        require: '^kanban',
        link: function ($scope, $element, $attrs, kanban) {
            $scope.fields = angular.extend(angular.copy(kanbanCardFields), $scope.settings.tasksDisplayFields);

            $scope.clickCallbacks = function (task, $event, force) {
                $event.stopPropagation();

                if ($scope.settings.enableMultiSelect && ($event.ctrlKey || $event.metaKey)) {
                    return;
                }

                if ($scope.settings.legacyCardModal && !force) {
                    $scope.$emit('kanban:task:modalopen', task);
                } else if (!task.$edit) {
                    openTaskCard(task, $scope.settings);
                }
            };

            $scope.highlightTask = function(task, $event){
                fixIE9('unselect-text');
                if (!task.$edit && $scope.settings.highlightTaskOnClick) {
                    if (!$scope.settings.enableMultiSelect) {
                        kanban.highlightTask(task);
                    } else if ($event.ctrlKey || $event.metaKey) {
                        task.$highlight = !task.$highlight;
                    } else if (!task.$highlight) {
                        kanban.highlightTask(task);
                    }
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
                openConfirmationModal($scope).then(function () {
                    task.remove();
                    $rootScope.$broadcast('kanban:task:remove', task.id);
                });
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
            };
        }
    };
});
