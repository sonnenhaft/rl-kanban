angular.module('component.kanban-card').directive('kanbanCard', function (extendedCard) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function (scope) {
            scope.clickCallbacks = function (task, settings, $event) {
                extendedCard.open(task, settings);
            };
        }
    };
}).directive('ngLazyClick', ['$parse', function($parse) {
    return {
        compile: function($element, attr) {
            var fn = $parse(attr["ngLazyClick"]);
            return function handler(scope, element) {
                element.on('click', function(event) {
                    scope.$apply(function() {
                        fn(scope, {$event:event});
                    });
                });
            };
        }
    };
}]);