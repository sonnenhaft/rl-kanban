angular.module('kanban').directive('scrollableElement', function ($window, $interval) {
    var SCROLL_STEP = 10;
    var SENSITIVITY_AREA = SCROLL_STEP * 2;
    var CHECK_INTERVAL = 30;

    var $body = angular.element($window.document.body);

    return {
        controller: function ($element) {
            var el  = $element[0];
            function getCoordinatePartToScroll(coord, dimensionProp, scrollProp, om, og) {
                var a = $window[dimensionProp];
                var b = $window[scrollProp];
                var a = el[om];
                var b = el[og]
                if (coord > a + b - SENSITIVITY_AREA) {
                    return SCROLL_STEP;
                } else if (coord < b + SENSITIVITY_AREA) {
                    return -SCROLL_STEP;
                } else {
                    return 0;
                }
            }

            var scrollInterval, y, x;

            function scrollOnBorder(mouseMoveEvent) {
                y = getCoordinatePartToScroll(mouseMoveEvent.y, 'innerHeight', 'scrollY', 'offsetHeight', 'scrollTop');
                x = getCoordinatePartToScroll(mouseMoveEvent.x, 'innerWidth', 'scrollX', 'offsetWidth', 'scrollLeft');
                if ((x || y) && !scrollInterval) {
                    scrollInterval = $interval(function () {
                        if (x || y) {
                            a = el
                            el.scrollTop += y;
                            el.scrollLeft += x;
                            //$window.scrollTo($window.scrollX + x, $window.scrollY + y);
                        } else {
                            clearInterval();
                        }
                    }, CHECK_INTERVAL, 0, false);
                }
            }

            function clearInterval() {
                $interval.cancel(scrollInterval);
                scrollInterval = null;
            }

            function touchOnBorder(e) {
                var firstTouch = e.touches[0];
                scrollOnBorder({
                    x: firstTouch.clientX,
                    y: firstTouch.clientY
                })
            }

            console.log($element)
            this.watchMouse = function () {
                $body
                    .bind('mousemove', scrollOnBorder)
                    .bind('touchmove', touchOnBorder);
            };

            this.stopWatching = function () {
                $body
                    .unbind('mousemove', scrollOnBorder)
                    .unbind('touchmove', touchOnBorder);
                if (scrollInterval) {
                    clearInterval();
                }
            };
        }
    }
});
