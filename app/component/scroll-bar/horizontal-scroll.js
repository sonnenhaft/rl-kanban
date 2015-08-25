angular.module('component.scroll-bar').directive('horizontalScroll', function () {
    return {
        restrict: 'A',
        require: '^combineHorizontalScrolls',
        link: function (scope, element, attrs, ctrl) {
            ctrl.registerScrollElement(element);

            scope.$on('$destroy', function () {
                ctrl.removeScrollElemnt(element);
            });
        }
    };
});