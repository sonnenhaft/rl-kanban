angular.module('component.task-groups.task-group').directive('deltaDragHandler', function ($window) {
    var $rootElement = angular.element($window.document.documentElement);

    function touchToMouse(e) {
        var firstTouch = e.touches[0];
        firstTouch.preventDefault = function () {
            e.preventDefault();
        };
        return firstTouch;
    }

    function DeltaDragHandler($element, callbacks) {
        angular.extend(this, callbacks);
        var eventObject = this;

        var scrollableElement = callbacks.scrollableElement;

        function dragListen(e) {
            var lastEvent = e;

            var originalPageX = e.pageX;
            var originalPageY = e.pageY;
            var initialLeft = scrollableElement.element.scrollLeft;
            var initialTop = scrollableElement.element.scrollTop;

            function sendDelta(e, fn, scroll) {
                var deltaX = e.pageX - originalPageX + scrollableElement.element.scrollLeft - initialLeft;
                var deltaY = e.pageY - originalPageY + scrollableElement.element.scrollTop - initialTop;
                fn(deltaX, deltaY, scroll);
                lastEvent = e;
            }

            function mouseMoveWrapper(e) {
                if (!eventObject.$moved) {
                    eventObject.$moved = true;
                    $element.css('z-index', 9999);
                    $rootElement.css('cursor', 'pointer');
                    eventObject.start();
                    if (scrollableElement) {
                        scrollableElement.watchMouse(function() {
                            sendDelta(lastEvent, eventObject.move, true);
                        });
                    }
                }
                sendDelta(e, eventObject.move);
            }

            function touchMove(e) { mouseMoveWrapper(touchToMouse(e));}

            $rootElement.bind('mousemove', mouseMoveWrapper);
            $rootElement.bind('touchmove', touchMove);

            function mouseUp() {
                $rootElement.unbind('mousemove', mouseMoveWrapper);
                $rootElement.unbind('touchmove', touchMove);
                $rootElement.unbind('mouseup', mouseUp);
                $rootElement.unbind('toucheEnd', mouseUp);
                if (eventObject.$moved) {
                    eventObject.$moved = false;
                    $rootElement.css('cursor', 'default');
                    $element.css('z-index', 0);
                    if (scrollableElement) {
                        scrollableElement.stopWatching();
                    }
                    sendDelta(lastEvent, eventObject.stop);
                } else {
                    eventObject.simpleClick();
                }
            }

            $rootElement.bind('mouseup', mouseUp);
            $rootElement.bind('touchend', mouseUp);
            e.preventDefault();
        }

        $element.bind('mousedown', dragListen);
        $element.bind('touchstart', function (e) {
            dragListen(touchToMouse(e));
        });
    }
    
    return function ($scope, $element, $attrs) {
        var watchOnce = $scope.$watch($attrs.deltaDragHandler, function(callbacks){
            watchOnce();
            if (callbacks.disabled) {return;}
            new DeltaDragHandler($element, callbacks); //jshint ignore: line
        });
    };
});