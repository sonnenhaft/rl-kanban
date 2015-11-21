angular.module('component.kanban-card').directive('kanbanCard', function (extendedCard, confirmationModal, $timeout, isTouch, $rootScope, $parse) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        require: '^kanban',
        link: function ($scope, $element, $attrs, kanban) {
            var modal;

            var parentSettings = $scope.$parent.settings || $scope.settings;
            ;
            $scope.fields = parentSettings.tasksDisplayFields;

            $scope.clickCallbacks = function (task, settings, $event, force) {
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
                } else if (!task.$edit) {
                    modal = extendedCard.open(task, settings);
                    modal.result.finally(function () {
                        modal = null;
                    });
                }
            };

            $scope.limit = 50;

            $scope.showFullDescription = function (task, settings, $event) {
                if (!task.$edit) {
                    $event.stopPropagation();
                    $scope.limit = task.notes.length;
                    if (settings.highlightTaskOnClick && !task.$edit) {
                        kanban.highlightTask(task);
                    }
                }
            };

            $scope.deleteTask = function ($event, task) {
                $event.stopPropagation();
                modal = confirmationModal.open();
                modal.result.then(function () {
                    task.remove();
                    $rootScope.$broadcast('kanban:task:remove', task.id);
                }).finally(function () {
                    modal = null;
                });
            };

            $scope.$on('$destroy', function () {
                if (modal) {
                    modal.dismiss('cancel');
                }
            });

            $scope.groupColor = $parse('group.color')($scope.task) || null;
            var borderColor = $scope.groupColor || '#326295';
            var wrapper = $element.children();

            $scope.$watch('task.$highlight', function (value, oldValue) {
                if (value !== oldValue) {
                    if (value) {
                        wrapper.addClass('card-highlight');
                        wrapper.css('borderColor', borderColor);
                    } else {
                        wrapper.removeClass('card-highlight');
                        wrapper.css('borderColor', 'transparent');
                    }
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
