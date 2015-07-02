angular.module('component.task-group').directive('taskGroup', function ($timeout, $window, taskGroupModal) { //jshint ignore: line
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
            width: '='
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

            $scope.$watch('group.$highlightedGroup', function (value) {
                if (value) {
                    taskGroupList.highlightGroup(group);
                }
            });

            var initialWidth, initialLeft, clone;
            var wasResize = false;

            var group = $scope.group;
            $scope.dragHandler = {
                simpleClick: function () {
                    if (group.$expandedGroup) {
                        taskGroupModal.open(group).result.then(function () {
                            group.remove();
                            taskGroupList.removeGroup(group);
                        });
                    } else {
                        taskGroupList.cleanExpanded(group);
                    }
                    taskGroupList.highlightGroup(group);
                },
                start: function () {
                    $scope.$apply(function () {
                        group.highlightTasks(true);
                        taskGroupList.highlightGroup(group);
                    });
                    clone = $element.clone();
                    clone.children().css({borderColor: group.color}).addClass('opacity');
                    $element.after(clone).addClass('draggy');
                    clone.parent().prepend($element);
                    scrollableElement.watchMouse();
                    initialLeft = group.start;
                    initialWidth = group.width;
                },
                move: function (deltaX) {
                    var elementHeight = $element.prop('offsetHeight');
                    clone.parent().css({'margin-top': elementHeight + 'px'});
                    $element.css({'margin-top': -elementHeight + 'px'});

                    var snapX = snapValue(deltaX / groupWidth, SNAP_SENSITIVITY);
                    if ($scope.resize) {
                        wasResize = true;
                        if (initialWidth + snapX >= 1) {
                            group.width = initialWidth + snapX;
                        }
                    } else if (initialLeft + snapX >= 0) {
                        group.start = initialLeft + snapX;
                    }

                    setLeft(group.start);
                    setWidth(group.width);
                },
                stop: function (deltaX) {
                    clone.parent().css('margin-top', 0);
                    $element.css('margin-top', 0);
                    clone.after($element.removeClass('draggy')).remove();
                    scrollableElement.stopWatching();
                    var snapX = Math.round(deltaX / groupWidth);
                    if (snapX) {
                        if (wasResize) {
                            group.width = initialWidth + snapX;
                            if (group.width < 1) {
                                group.width = 1;
                            }
                            group.expand();
                        } else {
                            group.start = initialLeft + snapX;
                            if (group.start < 0) {
                                group.start = 0;
                                group.shrink(-initialLeft);
                            } else {
                                group.shrink(snapX);
                            }
                        }
                        group.$lastTouched = true;
                        taskGroupList.recalculatePositions();
                    } else {
                        group.width = initialWidth;
                        group.start = initialLeft;
                        setLeft(initialLeft);
                        setWidth(initialWidth);
                        wasResize = false;
                    }
                    $scope.$apply();
                }
            };
        },
        templateUrl: 'app/component/task-group/task-group.html'
    };
});