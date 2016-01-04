angular.module('component.scrollable-element').directive('scrollableElement', function ($window, ScrollableElementFactory) {
    var SCROLL_STEP = 75;
    var SENSITIVITY_AREA = 50;
    var srollDelta;

    function getCoordinatePartToScroll(coord, dimensionProp) {
        var delta = coord - dimensionProp;
        if (delta + SENSITIVITY_AREA > 0) {
            srollDelta = parseInt(SCROLL_STEP / Math.abs(delta)) || SCROLL_STEP;
            return delta <= 0 ? Math.ceil(srollDelta / 10) * 10 : SCROLL_STEP;
        } else if (coord < SENSITIVITY_AREA) {
            srollDelta = parseInt(SCROLL_STEP / Math.abs(coord)) || SCROLL_STEP;
            return coord >= 0 ? -Math.ceil(srollDelta / 10) * 10 : -SCROLL_STEP;
        } else {
            return 0;
        }
    }

    var windowElement = angular.element($window);

    return {
        controller: function ($element) {
            var fn = angular.noop;
            var e = $element[0];

            function runFn(x, y) {
                x = e.scrollLeft && e.scrollLeft < e.scrollWidth - e.clientWidth - 1 ? x : 0;
                y = e.scrollTop && e.scrollTop < e.scrollHeight - e.clientHeight - 1 ? y : 0;
                if (x || y) {
                    fn(x, y);
                }
            }

            var elementScroll = new ScrollableElementFactory(function (x, y) {
                e.scrollTop += y;
                e.scrollLeft += x;
                runFn(x, y);
            });

            elementScroll.calculateDot = function (mouseMoveEvent) {
                this.y = getCoordinatePartToScroll($window.pageYOffset + mouseMoveEvent.clientY - e.offsetTop, e.offsetHeight);
                this.x = getCoordinatePartToScroll($window.pageXOffset + mouseMoveEvent.clientX - e.offsetLeft, e.offsetWidth);
            };

            var lastEvent;
            var windowScroll = new ScrollableElementFactory(function (x, y) {
                $window.scrollTo($window.pageXOffset + x, $window.pageYOffset + y);
                elementScroll.scrollIfNecessary(lastEvent);
            });

            windowScroll.calculateDot = function (mouseMoveEvent) {
                this.y = getCoordinatePartToScroll(mouseMoveEvent.clientY, $window.innerHeight);
                this.x = getCoordinatePartToScroll(mouseMoveEvent.clientX, $window.innerWidth);
            };

            function scrollOnBorder(e) {
                lastEvent = e;
                elementScroll.scrollIfNecessary(e);
                windowScroll.scrollIfNecessary(e);
            }

            function touchOnBorder(e) {
                var firstTouch = e.touches[0];
                scrollOnBorder({
                    x: firstTouch.pageX - $window.pageXOffset,
                    y: firstTouch.pageY - $window.scrollY,
                    clientX: firstTouch.clientX,
                    clientY: firstTouch.clientY
                });
            }

            this.watchMouse = function (_fn) {
                fn = _fn || fn;
                windowElement.on('mousemove', scrollOnBorder);
                windowElement.on('touchmove', touchOnBorder);
            };

            this.stopWatching = function () {
                windowElement.off('mousemove', scrollOnBorder);
                windowElement.off('touchmove', touchOnBorder);
                elementScroll.stopInterval();
                windowScroll.stopInterval();
            };
        }
    };
});
