angular.module('component.draggable-label').directive('draggableLabel', function (deltaDragHandler) { //jshint ignore: line
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
                var draggableLabelsControl = require[0],
                    scrollableElement = require[1],
                    groupWidth = $scope.width,
                    groupHeight = $scope.height;

                function setTop(top) {
                    $element.css({top: (top * groupHeight + 4) + 'px'});
                }

                function setLeft(leftPx) {
                    $element.css({left: (leftPx * groupWidth + 4) + 'px'});
                }

                function setWidth(width) {
                    $element.css('width', (width * groupWidth - 4 * 2) + 'px');
                }

                $scope.$watch('group.start', setLeft);
                $scope.$watch('group.index', setTop);
                $scope.$watch('group.width', setWidth);

                var $deltaDraggableElement = deltaDragHandler($element);

                var initialWidth, initialTop, initialLeft;
                $deltaDraggableElement.start(function () {
                    $scope.$apply(function(){
                        $scope.group.highlightTasks(true);
                    });
                    scrollableElement.watchMouse();
                    initialLeft = $scope.group.start;
                    initialTop = $scope.group.index;
                    initialWidth = $scope.group.width;
                });

                function updatePosition(deltaX, deltaY, sensivity) {
                    var snapX = snapValue(deltaX / groupWidth, sensivity);
                    if (!$scope.resize) {
                        if (initialLeft + snapX >= 0) {
                            $scope.group.start = initialLeft + snapX;
                        }
                        draggableLabelsControl.updateIndex($scope.group.index, initialTop + Math.round(deltaY / groupHeight));
                    } else if (initialWidth - snapX >= 1 && initialLeft + snapX >= 0) {
                        $scope.group.start = initialLeft + snapX;
                        $scope.group.width = initialWidth - snapX;
                    }
                    $scope.$digest();
                }

                $deltaDraggableElement.move(function (deltaX, deltaY) {
                    updatePosition(deltaX, deltaY, SNAP_SENSITIVITY);
                });

                $deltaDraggableElement.stop(function (deltaX/*, deltaY*/) {
                    $scope.group.highlightTasks(false);
                    scrollableElement.stopWatching();
                    var snapX = snapValue(deltaX / groupWidth, 1);
                    if (snapX) {
                        if ($scope.group.width === initialWidth) {
                            $scope.group.start = initialLeft + snapX;
                            $scope.group.shrink(snapX);
                        } else if ($scope.group.width !== initialWidth) {
                            $scope.group.width = initialWidth - snapX;
                            $scope.group.start = initialLeft + snapX;
                            $scope.group.expand();
                        }
                    } else {
                        $scope.group.width = initialWidth;
                        $scope.group.start = initialLeft;
                    }
                    $scope.$apply();
                });
            },
            templateUrl: 'app/component/draggable-label/draggable-label.html'
        };
    });