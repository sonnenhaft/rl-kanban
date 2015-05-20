angular.module('component.draggable-label').factory('deltaDragHandler', function ($window) {
    var $rootElement = angular.element($window.document.documentElement);
    function touchToMouse(e) {
        var firstTouch = e.touches[0];
        firstTouch.preventDefault = function(){
            e.preventDefault();
        };
        return firstTouch;
    }

    function DeltaDragHandler($element) {
        var that = this;
        function dragListen(e) {
            that._mouseDown();
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

            function mouseMoveWrapper(e) { sendDelta(e, that._mouseMove);}

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
                sendDelta(lastEvent, that._mouseUp);
            }

            $rootElement.bind('mouseup', mouseUp);
            $rootElement.bind('touchend', mouseUp);
            e.preventDefault();
        }

        $element.bind('mousedown', dragListen);
        $element.bind('touchstart', function(e){
            dragListen(touchToMouse(e));
        });
    }

    DeltaDragHandler.prototype = {
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
        return new DeltaDragHandler($element);
    };
});