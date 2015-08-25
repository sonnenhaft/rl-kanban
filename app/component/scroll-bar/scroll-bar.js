angular.module('component.scroll-bar').directive('scrollbar', function () {return {template: '<div class="inner" columns-width></div>'};})


    .directive('columnsWidth', function () {
        return {
            restrict: 'A',
            require: '^kanban',
            link: function (scope, element, attrs, kanban) {
                kanban.registerElement(element);

                scope.$on('$destroy', function () {
                    kanban.removeElement(element);
                });
            }
        };
    });