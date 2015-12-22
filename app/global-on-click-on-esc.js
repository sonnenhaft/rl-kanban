angular.module('kanban').factory('globalOnEsc', function ($window) {
    var $body = angular.element($window.document.body);
    return function (fn) {

        function onEscPressed(e) {
            if (e.which === 27) { fn();}
        }

        $body.bind('keyup', onEscPressed).bind('click', fn);
        return function () {
            $body.unbind('keyup', onEscPressed).unbind('click', fn);
        };
    };
});
