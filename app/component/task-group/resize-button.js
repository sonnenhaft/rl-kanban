angular.module('component.task-group').directive('resizeButton', function ($window) {
    var $rootElement = angular.element($window.document.documentElement);
    var body = angular.element($window.document.body);
    return function ($scope, $element) {
        function mouseDown() {
            $rootElement.bind('mouseup', mouseUp);
            $rootElement.bind('touchend', mouseUp);
            $scope.resize = true;
            body.css('cursor', 'col-resize');
        }

        function mouseUp() {
            $rootElement.unbind('mouseup', mouseUp);
            $rootElement.unbind('touchend', mouseUp);
            $scope.resize = false;
            body.css('cursor', 'default');
        }

        $element.bind('mousedown', mouseDown);
        $element.bind('touchstart', mouseDown);
    };
});