angular.module('component.scroll-bar').directive('scrollbar', function () {
    return {
        templateUrl: 'app/component/scroll-bar/scroll-bar.html',
        scope: {
            columns: '='
        },
        require: '^combineHorizontalScrolls',
        link: function ( $scope, $element, $attrs, combineHorizontalScrolls ) {
            combineHorizontalScrolls.scrollBarElement = $element[ 0 ];

            $scope.$on('$destroy', function () {
                combineHorizontalScrolls.scrollBarElement = null;
            });
        }
    };
}).directive('columnsWidth', function () {
    return {
        restrict: 'A',
        require: '^kanban',
        link: function ( $scope, $element, ignored, kanban ) {
            kanban.registerElement($element, $scope);
        }
    };
});
