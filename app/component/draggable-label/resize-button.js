angular.module('component.draggable-label').directive('resizeButton', function ($window) {
    var $rootElement = angular.element($window.document.documentElement);
    return function ($scope, $element) {
        $element.bind('mousedown', mouseDown);
        $element.bind('touchstart', mouseDown);

        function mouseDown() {
            $rootElement.bind('mouseup', mouseUp);
            $rootElement.bind('touchend', mouseUp);
            $scope.resize = true;
        }

        function mouseUp() {
            $rootElement.unbind('mouseup', mouseUp);
            $rootElement.unbind('touchend', mouseUp);
            $scope.resize = false;
        }
    }
});