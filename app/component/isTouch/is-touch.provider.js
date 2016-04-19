angular.module('component.is-touch', [
]).provider('isTouch', function () {
    this.$get = function ($window) {
        return (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/).test($window.navigator.userAgent);
    };
}).factory('isNotTouch', function(isTouch){
    return !isTouch;
});