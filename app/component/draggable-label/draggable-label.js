angular.module('component.draggable-label').directive('draggableLabel', function ($timeout) { //jshint ignore: line
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
        scope: {
            group: '=',
            height: '=labelHeight',
            width: '='
        },
        require: ['^draggableLabelsControl', '^scrollableElement'],
        link: function ($scope, $element, ignored, require) {
            var draggableLabelsControl = require[0];
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
                $timeout(function(){
                    $element.addClass('blink');
                    $timeout(function(){
                        $element.removeClass('blink');
                    }, 500, false)
                }, 100, false);
            }
            var initialWidth, initialLeft, clone;

            $scope.dragHandler = {
                start: function () {
                    clone = $element.clone().css({opacity: 0.5,'margin-top': '28px'});
                    $element.after(clone).addClass('draggy');
                    clone.parent().prepend($element);

                    $scope.$apply(function () {
                        group.highlightTasks(true);
                    });

                    scrollableElement.watchMouse();
                    initialLeft = group.start;
                    initialWidth = group.width;
                    setLeft(group.start);
                },
                move: function (deltaX) {
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
                        draggableLabelsControl.recalculatePositions();
                    } else {
                        group.width = initialWidth;
                        group.start = initialLeft;
                         setLeft(group.$lineSpace)
                    }

                    $scope.$apply();
                }
            };
        },
        templateUrl: 'app/component/draggable-label/draggable-label.html'
    };
});