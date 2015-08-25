angular.module('component.is-touch', []).provider('isTouch', function () {
    this.$get = function ($window) {
        return 'ontouchstart' in $window || $window.DocumentTouch && $window.document instanceof $window.DocumentTouch;
    }
}).factory('isNotTouch', function(isTouch){
    return !isTouch;
});