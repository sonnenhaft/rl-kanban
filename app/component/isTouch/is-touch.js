angular.module('component.is-touch', []).provider('isTouch', function () {
    this.$get = function ($window) {
        return (/Mobile|iP(hone|od|ad)|Android|BlackBerryt|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/).test($window.navigator.userAgent);
    };
}).factory('isNotTouch', function(isTouch){
    return !isTouch;
});