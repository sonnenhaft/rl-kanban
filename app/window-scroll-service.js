angular.module('kanban').factory('windowScrollService', function ($window, $interval) {
    var SCROLL_STEP = 10;
    var SENSITIVITY_AREA = SCROLL_STEP * 2;
    var CHECK_INTERVAL = 30;

    function getCoordinatePartToScroll(coord, dimensionProp, scrollProp) {
        if (coord > $window[dimensionProp] + $window[scrollProp] - SENSITIVITY_AREA) {
            return SCROLL_STEP;
        } else if (coord < $window[scrollProp] + SENSITIVITY_AREA) {
            return -SCROLL_STEP;
        } else {
            return 0;
        }
    }

    var scrollInterval, y, x;

    function clearInterval() {
        $interval.cancel(scrollInterval);
        scrollInterval = null;
    }

    function scrollOnBorder(mouseMoveEvent) {
        y = getCoordinatePartToScroll(mouseMoveEvent.y, 'innerHeight', 'scrollY');
        x = getCoordinatePartToScroll(mouseMoveEvent.x, 'innerWidth', 'scrollX');
        console.log(x)
        if ((x || y) && !scrollInterval) {
            scrollInterval = $interval(function () {
                if (x || y) {
                    $window.scrollTo($window.scrollX + x, $window.scrollY + y);
                } else {
                    clearInterval();
                }
            }, CHECK_INTERVAL, 0, false);
        }
    }

    var $body = angular.element($window.document.body);

    function touchOnBorder(e) {
        var firstTouch = e.touches[0];
        scrollOnBorder({
            x: firstTouch.clientX,
            y: firstTouch.clientY
        })
    }

    return {
        watchMouse: function () {
            $body
                .bind('mousemove', scrollOnBorder)
                .bind('touchmove', touchOnBorder);
        },
        stopWatching: function () {
            $body
                .unbind('mousemove', scrollOnBorder)
                .unbind('touchmove', touchOnBorder);
            if (scrollInterval) {
                clearInterval();
            }
        }
    };
});
