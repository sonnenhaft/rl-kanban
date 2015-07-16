angular.module('component.expand-collapse', [])
    .directive('expandCollapse', function ($animate, $parse) {
        return {
            link: function (scope, element, attrs) {

                var isDisabled = $parse(attrs.expandDisabled)(scope);
                if (isDisabled) {return;}

                function toggleCollapse(value) {
                    if (value) {
                        element.removeClass('kanban-collapse').addClass('kanban-collapsing');
                        $animate.addClass(element, 'kanban-in', {
                            to: {height: element[0].scrollHeight + 'px'}
                        }).then(function () {
                            element.removeClass('kanban-collapsing');
                            element.css({height: 'auto'});
                        });
                    } else {
                        element
                            .css({height: element[0].scrollHeight + 'px'})
                            .removeClass('kanban-collapse')
                            .addClass('kanban-collapsing');

                        $animate.removeClass(element, 'kanban-in', {
                            to: {height: '0'}
                        }).then(function () {
                            element.css({height: '0'});
                            element.removeClass('kanban-collapsing');
                            element.addClass('kanban-collapse');
                        });
                    }
                }

                scope.$watch(attrs.expandCollapse, toggleCollapse);
            }
        };
    });