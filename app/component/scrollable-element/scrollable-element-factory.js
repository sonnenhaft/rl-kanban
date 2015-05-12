angular.module('component.scrollable-element').factory('ScrollableElementFactory', function ($interval) {
    var CHECK_INTERVAL_MILLIS = 100;

    function ScrollableElementFactory(fn) {
        this.fn = fn;
    }

    ScrollableElementFactory.prototype = {
        stopInterval: function () {
            if (this.interval) {
                $interval.cancel(this.interval);
                this.interval = null;
            }
        },
        dotReady: function () {
            return this.x || this.y;
        },
        runInterval: function () {
            var that = this;
            if (!this.interval) {
                this.interval = $interval(function () {
                    if (that.dotReady()) {
                        that.fn(that.x, that.y);
                    } else {
                        that.stopInterval();
                    }
                }, CHECK_INTERVAL_MILLIS, 0, false);
            }
        },
        scrollIfNecessary: function (e) {
            this.calculateDot(e);
            if (this.dotReady()) {
                this.runInterval();
            }
        }
    };
    return ScrollableElementFactory;
});
