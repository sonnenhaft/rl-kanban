angular.module('component.scroll-bar').directive('scrollbar', function () {
    return {
        templateUrl: 'app/component/scroll-bar/scroll-bar.html',
        scope: {
            columns: '='
        },
        require: '^combineHorizontalScrolls',
        link: function (scope, element, attrs, ctrl) {
            ctrl.scrollBarElement = element[0];

            scope.$on('$destroy', function () {
                ctrl.scrollBarElement = null;
            });
        }
    };
});