angular.module('component.expand-collapse',[])
    .directive('expandCollapse', function($animate){
    return {
        link: function(scope, element, attrs){
            function toggleCollapse(value) {
                if (value) {
                    element.removeClass('collapse').addClass('collapsing');
                    $animate.addClass(element, 'in', {
                        to: { height: element[0].scrollHeight + 'px' }
                    }).then(function(){
                        element.removeClass('collapsing');
                        element.css({height: 'auto'});
                    });
                } else {
                    element
                        .css({height: element[0].scrollHeight + 'px'})
                        .removeClass('collapse')
                        .addClass('collapsing');

                    $animate.removeClass(element, 'in', {
                        to: {height: '0'}
                    }).then(function(){
                        element.css({height: '0'});
                        element.removeClass('collapsing');
                        element.addClass('collapse');
                    });
                }
            }

            scope.$watch(attrs.expandCollapse, toggleCollapse);
        }
    };
});