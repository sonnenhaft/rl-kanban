angular.module('component.task-groups.task-group').directive('resizeButton', function ($window) {
    var $rootElement = angular.element($window.document.documentElement);
    var body = angular.element($window.document.body);
    return function ($scope, $element, $attrs) {
        function mouseUp() {
            $rootElement.unbind('mouseup', mouseUp);
            $rootElement.unbind('touchend', mouseUp);
            $scope[$attrs.resizeButton] = false;
            body.css('cursor', 'default');
        }

        function mouseDown() {
            $rootElement.bind('mouseup', mouseUp);
            $rootElement.bind('touchend', mouseUp);
            $scope[$attrs.resizeButton] = true;
            $scope.resize = true;
            body.css('cursor', 'col-resize');
        }

        $element.bind('mousedown', mouseDown);
        $element.bind('touchstart', mouseDown);
    };
});