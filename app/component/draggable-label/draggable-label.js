angular.module('component.draggable-label').directive('draggableLabel', function (deltaDragHandler, kanbanCardService, kanbanGroupService, kanbanService, $timeout) { //jshint ignore: line
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
                    scrollableElement.stopWatching();
                    var snapX = snapValue(deltaX / groupWidth, 1);
                    if (snapX) {
                        if ($scope.group.width === initialWidth) {
                            kanbanService.shift($scope.group.id, snapX);
                            $scope.group.start = initialLeft + snapX;
                        } else if ($scope.group.width !== initialWidth) {
                            kanbanService.spread($scope.group.id, snapX, initialWidth - snapX);
                            $scope.group.width = initialWidth - snapX;
                            $scope.group.start = initialLeft + snapX;
                        }
                    } else {
                        $scope.group.width = initialWidth;
                        $scope.group.start = initialLeft;
                    }
                    $scope.$apply();
                });

                kanbanGroupService.registerGroup($scope.group.id, $scope);

                $scope.remove = function () {
                    $scope.group.remove();
                    var cards = kanbanCardService.getCardsByGroupId($scope.group.id);
                    angular.forEach(cards, function (card) {
                        $timeout(function () {
                            card.sortableScope.removeItem(card.index());
                        });
                    });
                    kanbanGroupService.removeGroup($scope.group.id);
                };

                $scope.checkPosition = function (fromColumn, toColumn) {
                    var start = $scope.group.start;
                    var end = start + $scope.group.width - 1;

                    if (start > toColumn) {
                        $scope.group.width = start - toColumn + $scope.group.width;
                        $scope.group.start = toColumn;
                    } else if (end < toColumn) {
                        $scope.group.width = toColumn - start + 1;
                    }
                };

                $scope.setEnd = function (index) {
                    $scope.group.width = index - $scope.group.start + 1;
                };

                $scope.setStart = function (index) {
                    var end = $scope.group.width + $scope.group.start - 1;
                    $scope.group.start = index;
                    $scope.group.width = end - $scope.group.start + 1;
                };

                $scope.getGroupPosition = function () {
                    return {
                        start: $scope.group.start,
                        end: $scope.group.width + $scope.group.start - 1
                    };
                };
            },
            templateUrl: 'app/component/draggable-label/draggable-label.html'
        };
    });