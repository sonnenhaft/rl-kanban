angular.module('component.task-group').directive('taskGroup', function ($timeout) { //jshint ignore: line
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

            function setLeft(leftPx) {
                $element.css({'margin-left': leftPx * groupWidth + 'px'});
            }

            function setWidth(width) {
                $element.css('width', width * groupWidth + 'px');
            }

            $scope.$watch('group.$lineSpace', setLeft);
            $scope.$watch('group.width', setWidth);

            $scope.$watch('group.$recalculated', function (value) {
                if (value) {
                    delete $scope.group.$recalculated;
                    taskGroupList.recalculatePositions();
                }
            });

            var group = $scope.group;

            if (group.$lastTouched) {
                delete group.$lastTouched;
                $element.addClass('blink');
                $timeout(function () {
                    $timeout(function () {
                        $element.removeClass('blink');
                    }, 500, false);
                }, 100, false);
            }
            var initialWidth, initialLeft, clone;

            var wasResize = false;
            $scope.dragHandler = {
                start: function () {
                    taskGroupList.cleanExpanded(group);
                    $scope.$apply(function () {
                        group.highlightTasks(true);
                    });

                    clone = $element.clone().css({opacity: 0.5});
                    $element.after(clone).addClass('draggy');
                    clone.parent().prepend($element);

                    scrollableElement.watchMouse();
                    initialLeft = group.start;
                    initialWidth = group.width;
                    setLeft(group.start);
                },
                move: function (deltaX) {
                    clone.css({'margin-top': $element.prop('offsetHeight') + 'px'});
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
                    clone.after($element.removeClass('draggy')).remove();
                    group.highlightTasks(false);
                    scrollableElement.stopWatching();
                    var snapX = snapValue(deltaX / groupWidth, 1);
                    if (wasResize) {
                        group.width = initialWidth + snapX;
                    } else {
                        group.start = initialLeft + snapX;
                    }

                    if (group.width === initialWidth && group.start === initialLeft) {
                        group.width = initialWidth;
                        group.start = initialLeft;
                        setLeft(group.$lineSpace);
                        wasResize = false;
                    } else {
                        if (wasResize) {
                            group.expand();
                        } else {
                            group.shrink(snapX);
                        }
                        group.$lastTouched = true;
                        taskGroupList.recalculatePositions();
                    }

                    $scope.$apply();
                }
            };
        },
        templateUrl: 'app/component/task-group/task-group.html'
    };
});