angular.module('component.scrollable-element').factory('ScrollableElementFactory', function ($interval) {
    var CHECK_INTERVAL_MILLIS = 50;
    var MINIMAL_VALUE_TO_SCROLL = 25;

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
        minValue: function (value) {
            if (value) {
                if (value > 0) {
                    value = Math.max(value, MINIMAL_VALUE_TO_SCROLL);
                } else {
                    value = Math.min(value, -MINIMAL_VALUE_TO_SCROLL);
                }
            }
            return value;
        },
        runInterval: function () {
            var that = this;
            if (!this.interval) {
                this.interval = $interval(function () {
                    if (that.dotReady()) {
                        that.fn(that.minValue(that.x), that.minValue(that.y));
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
