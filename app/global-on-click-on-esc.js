angular.module('kanban').factory('globalOnClickOnEsc', function ($window) {
    var $body = angular.element($window.document.body);
    return function (fn, $scope) {

        function onEscPressed(e) {
            if (e.which === 27) {
                fn();
            }
        }

        $body.bind('keyup', onEscPressed).bind('click', fn);

        return function () {
            $body.unbind('keyup', onEscPressed).unbind('click', fn)
        }
    }
});
