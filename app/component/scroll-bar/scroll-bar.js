angular
    .module('component.scroll-bar')
    .directive('scrollbar', function () {
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
    }).directive('columnsWidth', function () {
        return {
            restrict: 'A',
            require: '^kanban',
            link: function (scope, element, attrs, kanban) {
                kanban.registerElement(element, scope);
            }
        };
    });