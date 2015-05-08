angular.module('kanban').factory('windowScrollService', function ($window, $interval) {
    function getCoordinatePartToScroll(coord, windowProperty) {
        if (coord > $window[windowProperty] - 10) {
            return 10;
        } else if (coord < 10) {
            return -10;
        } else {
            return 0;
        }
    }

    var scrollInterval, y, x;

    function clearInterval() {
        $interval.cancel(scrollInterval);
        scrollInterval = null;
    }

    function scrollY(mouseMoveEvent) {
        y = getCoordinatePartToScroll(mouseMoveEvent.y, 'innerHeight');
        x = getCoordinatePartToScroll(mouseMoveEvent.x, 'innerWidth');
        if ((x || y) && !scrollInterval) {
            scrollInterval = $interval(function () {
                if (x || y) {
                    $window.scrollTo($window.scrollX + x, $window.scrollY + y);
                } else {
                    clearInterval();
                }
            }, 100, 0, false);
        }
    }

    return {
        watchMouse: function () {
            angular.element($window.document.body).bind('mousemove', scrollY);
        },
        stopWatching: function () {
            angular.element($window.document.body).unbind('mousemove', scrollY);
            if (scrollInterval) {
                clearInterval();
            }
        }
    };
});
