angular.module('component.task-group-control', []).directive('taskGroupControl', function () {
    return {
        templateUrl: 'app/component/task-group-control/task-group-control.html',
        controller: function ($scope, $element) {
            this.element = $element;
            $scope.groups = [
                {name: 'group 1', start: 0, width: 2},
                {name: 'group 2', start: 1, width: 5},
                {name: 'group 3', start: 2, width: 2},
                {name: 'group 4', start: 0, width: 7}
            ];
        }
    };
}).directive('taskGroup', function (handleDrag) {
    var minWidth = 150;
    var snapSendivity = 0.3;

    function snapValue(val, max, sensivity) {
        if (val % max > max * (1 - sensivity) || val % max < max * sensivity) {
            return Math.round(val / max) * max;
        } else {
            return val;
        }
    }

    return {
        scope: {
            width: '=',
            start: '=',
            name: '='
        },
        require: '^taskGroupControl',
        link: function ($scope, $element) {
            $element.css({
                width: $scope.width * minWidth + 'px',
                'margin-left': $scope.start * minWidth + 'px'
            });

            var $draggableElement = handleDrag($element);

            var initialMargin, initialWidth;

            function getWidth() {
                return $element.css('width').replace('px', '') - 0
            }

            $draggableElement.start(function () {
                initialMargin = $element.css('marginLeft').replace('px', '') - 0;
                initialWidth = getWidth();
            });

            function setCss(deltaX, deltaY, snapSendivity) {
                $element.css('marginLeft', snapValue(initialMargin + deltaX, minWidth, snapSendivity) + 'px');
                if ($scope.resize) {
                    if (initialWidth - deltaX < minWidth) {
                        $element.css('width', minWidth + 'px');
                    } else {
                        $element.css('width', snapValue(initialWidth - deltaX, minWidth, snapSendivity) + 'px');
                    }
                }
            }

            $draggableElement.move(function (deltaX, deltaY) {
                setCss(deltaX, deltaY, snapSendivity);
            });

            $draggableElement.stop(function (deltaX, deltaY) {
                setCss(deltaX, deltaY, 1);
            });
        },
        template: '<div><span ng-click="resize = true">==resize== </span> {{name}} {{resize}}</div>'
    }
}).factory('handleDrag', function ($window) {
    var $rootElement = angular.element($window.document.documentElement);

    function HandleDrag($element) {
        var that = this;
        $element.bind('mousedown', function (e) {
            that._mouseDown();
            var mouseDownEvent = e;

            function sendDelta(e, fn) {
                var deltaX = e.pageX - mouseDownEvent.pageX;
                var deltaY = e.pageY - mouseDownEvent.pageY;
                fn(deltaX, deltaY);
            }

            function mouseMoveWrapper(e) {
                sendDelta(e, that._mouseMove);
            }

            $rootElement.bind('mousemove', mouseMoveWrapper);
            $rootElement.bind('mouseup', function mouseUp(e) {
                // this unbinds are potential memory leaks place
                $rootElement.unbind('mousemove', mouseMoveWrapper);
                $rootElement.unbind('mouseup', mouseUp);

                sendDelta(e, that._mouseUp);
            });
            e.preventDefault();
        });
    }

    HandleDrag.prototype = {
        _mouseMove: function () {},
        _mouseUp: function () {},
        _mouseDown: function () {},
        start: function (fn) {
            this._mouseDown = fn;
            return this;
        },
        stop: function (fn) {
            this._mouseUp = fn;
            return this;
        },
        move: function (fn) {
            this._mouseMove = fn;
            return this;
        }
    };

    return function ($element) {
        return new HandleDrag($element);
    };
});