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
                $element.css({'margin-left': leftPx * groupWidth  + 'px'});
            }

            function setWidth(width) {
                $element.css('width', width * groupWidth  + 'px');
            }

            $scope.$watch('group.$lineSpace', setLeft);
            $scope.$watch('group.width', setWidth);

            var group = $scope.group;

            if (group.$lastTouched) {
                delete group.$lastTouched;
                $element.addClass('blink');
                $timeout(function(){
                    $timeout(function(){
                        $element.removeClass('blink');
                    }, 500, false)
                }, 100, false);
            }
            var initialWidth, initialLeft, clone;

            $scope.dragHandler = {
                start: function () {
                    taskGroupList.expandGroup(group);
                    $element.addClass('expanded-group'); //no to call async digest in here

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
                    if (!$scope.resize) {
                        if (initialLeft + snapX >= 0) {
                            group.start = initialLeft + snapX;
                        }
                    } else if (initialWidth - snapX >= 1 && initialLeft + snapX >= 0) {
                        group.start = initialLeft + snapX;
                        group.width = initialWidth - snapX;
                    }

                    setLeft(group.start);
                    setWidth(group.width);
                },
                stop:function (deltaX) {
                    clone.after($element.removeClass('draggy')).remove();
                    group.highlightTasks(false);
                    scrollableElement.stopWatching();
                    var snapX = snapValue(deltaX / groupWidth, 1);
                    if (snapX) {
                        group.start = initialLeft + snapX;
                        if (group.width === initialWidth) {
                            group.shrink(snapX);
                        } else {
                            group.width = initialWidth - snapX;
                            group.expand();
                        }
                        group.$lastTouched = true;
                        taskGroupList.recalculatePositions();
                    } else {
                        group.width = initialWidth;
                        group.start = initialLeft;
                         setLeft(group.$lineSpace)
                    }

                    $scope.$apply();
                }
            };
        },
        templateUrl: 'app/component/task-group/task-group.html'
    };
});