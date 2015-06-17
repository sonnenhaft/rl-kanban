angular.module('component.task-group').directive('deltaDragHandler', function ($window) {
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
        var that = this;

        function dragListen(e) {
            that.start();
            $element.css('z-index', 9999);
            $rootElement.css('cursor', 'pointer');
            var mouseDownEvent = e;

            var lastEvent = e;

            function sendDelta(e, fn) {
                var deltaX = e.pageX - mouseDownEvent.pageX;
                var deltaY = e.pageY - mouseDownEvent.pageY;
                fn(deltaX, deltaY);
                lastEvent = e;
            }

            function mouseMoveWrapper(e) { sendDelta(e, that.move);}

            function touchMove(e) { mouseMoveWrapper(touchToMouse(e));}

            $rootElement.bind('mousemove', mouseMoveWrapper);
            $rootElement.bind('touchmove', touchMove);

            function mouseUp() {
                $rootElement.unbind('mousemove', mouseMoveWrapper);
                $rootElement.unbind('touchmove', touchMove);
                $rootElement.unbind('mouseup', mouseUp);
                $rootElement.unbind('toucheEnd', mouseUp);
                $rootElement.css('cursor', 'default');
                $element.css('z-index', 0);
                sendDelta(lastEvent, that.stop);
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
    
    return function ($scope, $element, $attr) {
        var watchOnce = $scope.$watch($attr.deltaDragHandler, function(callbacks){
            watchOnce();
            new DeltaDragHandler($element, callbacks); //jshint ignore: line
        });
    };
});