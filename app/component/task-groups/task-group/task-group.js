angular.module('component.task-groups.task-group').directive('taskGroup', function ($timeout, $window, taskGroupModal) { //jshint ignore: line
    var SNAP_SENSITIVITY = 0.2;

    function snapValue(val, sensivity) {
        var ending = Math.abs(val % 1);
        if (1 - sensivity >= ending && ending >= sensivity) {
            return val;
        } else {
            return Math.round(val);
        }
    }

    return {
        replace: true,
        transclude: true,
        scope: {
            group: '=',
            width: '=',
            settings: '=',
            columns: '='
        },
        require: ['^taskGroupList', '^scrollableElement'],
        link: function ($scope, $element, ignored, require) {
            var taskGroupList = require[0];
            var scrollableElement = require[1];
            var groupWidth = $scope.width;

            function setLeft(leftPx) {$element.css({'margin-left': leftPx * groupWidth + 'px'});}

            function setWidth(width) {$element.css('width', width * groupWidth + 'px');}

            $scope.$watch('group.$lineSpace', setLeft);
            $scope.$watch('group.width', setWidth);

            $scope.$watch('group.$recalculated', function (value) {
                if (value) {
                    delete $scope.group.$recalculated;
                    taskGroupList.recalculatePositions();
                }
            });

            var group = $scope.group;
            $scope.$watch('group.$highlightedGroup', function (value) {
                if (value) {
                    taskGroupList.highlightGroup(group);
                }
            });
            var initialWidth, initialLeft, clone;

            var wasResize = false;
            var maxSnap;
            $scope.dragHandler = {
                simpleClick: function () {
                    if (group.$expandedGroup) {
                        taskGroupModal.open(group, $scope.settings).result.then(function () {
                            group.remove();
                            taskGroupList.removeGroup(group);
                        });
                    } else {
                        taskGroupList.cleanExpanded(group);
                    }
                    taskGroupList.highlightGroup(group);
                },
                scrollableElement: scrollableElement,
                start: function () {
                    if ($scope.settings.readOnly) {return;}
                    $scope.$apply(function () {
                        group.highlightTasks(true);
                        taskGroupList.highlightGroup(group);
                    });
                    clone = $element.clone();
                    clone.children().css({borderColor: group.color}).addClass('opacity');
                    $element.after(clone).addClass('draggy');
                    clone.parent().prepend($element);
                    initialLeft = group.start;
                    initialWidth = group.width;
                    maxSnap = $scope.columns.length - (group.start + group.width);
                },
                move: function (deltaX) {
                    if ($scope.settings.readOnly) { return;}
                    var elementHeight = $element.prop('offsetHeight');
                    clone.parent().css({'margin-top': elementHeight + 'px'});
                    $element.css({'margin-top': -elementHeight + 'px'});
                    var snapX = snapValue(deltaX / groupWidth, SNAP_SENSITIVITY);
                    if (snapX > maxSnap) {
                        snapX = maxSnap;
                    }
                    if ($scope.resize) {
                        wasResize = true;
                        var newWidth = initialWidth + snapX;
                        if (newWidth >= 1) {
                            group.width = newWidth;
                        }
                    } else {
                        var newLeft = initialLeft + snapX;
                        if (newLeft >= 0) {
                            group.start = newLeft;
                        }
                    }

                    setLeft(group.start);
                    setWidth(group.width);
                },
                stop: function (deltaX) { //jshint ignore:line
                    if ($scope.settings.readOnly) {return;}

                    var snapX = Math.round(deltaX / groupWidth);
                    if (snapX) {
                        if (snapX > maxSnap) {
                            snapX = maxSnap;
                        }
                        if (wasResize) {
                            group.width = initialWidth + snapX;
                            if (group.width < 1) {
                                group.width = 1;
                            }
                            group.expand();
                        } else {
                            if (group.start <= 0) {
                                group.start = 0;
                                group.shrink(-initialLeft);
                            } else {
                                group.start = initialLeft + snapX;
                                group.shrink(snapX);
                            }
                        }
                        group.$lastTouched = true;
                    } else {
                        group.width = initialWidth;
                        group.start = initialLeft;
                        setLeft(group.start);
                        setWidth(group.width);
                        wasResize = false;
                    }
                    clone.parent().css('margin-top', 0);
                    $element.css('margin-top', 0);
                    $element.after(clone).removeClass('draggy');
                    clone.remove();
                    taskGroupList.recalculatePositions();
                    $scope.$apply();
                }

            };
            $scope.getStyle = function (group, isHighlighted) {
                return {
                    'backgroundColor': isHighlighted ? group.color : angular.noop,
                    'borderColor': group.color
                };
            };
        },
        templateUrl: 'app/component/task-groups/task-group/task-group.html'
    };
});