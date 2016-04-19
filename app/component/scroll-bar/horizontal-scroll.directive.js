angular.module('component.scroll-bar').directive('horizontalScroll', function () {
    return {
        restrict: 'A',
        require: '^combineHorizontalScrolls',
        controller: function ($element) {
            this.$element = $element;
        },
        link: function ($scope, $element, ignored, combineHorizontalScrolls) {
            combineHorizontalScrolls.registerScrollElement($element);

            $scope.$on('$destroy', function () {
                combineHorizontalScrolls.removeScrollElement($element);
            });
        }
    };
});