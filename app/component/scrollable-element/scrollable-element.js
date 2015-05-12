angular.module('component.scrollable-element').directive('scrollableElement', function ($window, ScrollableElementFactory) {
    var SCROLL_STEP = 10;
    var SENSITIVITY_AREA = 30;

    function getCoordinatePartToScroll(coord, dimensionProp) {
        if (coord > dimensionProp - SENSITIVITY_AREA) {
            return SCROLL_STEP;
        } else if (coord < SENSITIVITY_AREA) {
            return -SCROLL_STEP;
        } else {
            return 0;
        }
    }

    var $body = angular.element($window.document.body);

    return {
        controller: function ($element) {
            var element = $element[0];

            var elementScroll = new ScrollableElementFactory(function (x, y) {
                element.scrollTop += y;
                element.scrollLeft += x;
            });

            elementScroll.calculateDot = function (mouseMoveEvent) {
                this.y = getCoordinatePartToScroll($window.scrollY + mouseMoveEvent.y - element.offsetTop, element.offsetHeight);
                this.x = getCoordinatePartToScroll($window.scrollX + mouseMoveEvent.x - element.offsetLeft, element.offsetWidth);
            };

            var lastEvent;
            var windowScroll = new ScrollableElementFactory(function (x, y) {
                $window.scrollTo($window.scrollX + x, $window.scrollY + y);
                elementScroll.scrollIfNecessary(lastEvent);
            });

            windowScroll.calculateDot = function (mouseMoveEvent) {
                this.y = getCoordinatePartToScroll(mouseMoveEvent.y, $window.innerHeight);
                this.x = getCoordinatePartToScroll(mouseMoveEvent.x, $window.innerWidth);
            };

            function scrollOnBorder(e) {
                lastEvent = e;
                elementScroll.scrollIfNecessary(e);
                windowScroll.scrollIfNecessary(e);
            }

            function touchOnBorder(e) {
                var firstTouch = e.touches[0];
                scrollOnBorder({
                    x: firstTouch.clientX,
                    y: firstTouch.clientY
                });
            }

            this.watchMouse = function () {
                $body.bind('mousemove', scrollOnBorder);
                $body.bind('touchmove', touchOnBorder);
            };

            this.stopWatching = function () {
                $body.unbind('mousemove', scrollOnBorder);
                $body.unbind('touchmove', touchOnBorder);
                elementScroll.stopInterval();
                windowScroll.stopInterval();
            };
        }
    }
});
