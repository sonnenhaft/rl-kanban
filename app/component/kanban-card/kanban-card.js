angular.module('component.kanban-card').directive('kanbanCard', function (extendedCard, $timeout, $window) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function (scope, element) {
            var modal;
            scope.clickCallbacks = function (task, settings) {
                modal = extendedCard.open(task, settings);
                modal.result.finally(function(){
                    modal = null;
                });
            };

            scope.$on('$destroy', function(){
                if (modal) {
                    modal.dismiss('cancel');
                }
            });

            var isTouch = 'ontouchstart' in $window || $window.DocumentTouch && $window.document instanceof $window.DocumentTouch;

            if (isTouch) {
                scope.$parent.settings.isDisabled = true;

                var timeout = null;
                element.on('touchstart', function () {
                    timeout = $timeout(function () {
                        scope.$parent.settings.isDisabled = false;
                    }, 500);
                });

                element.on('touchend', function () {
                    scope.$parent.settings.isDisabled = true;
                    $timeout.cancel(timeout);
                });

                var handler = angular.element(element[0].getElementsByClassName('card-handle')[0]);
                handler.on('touchstart', function () {
                    scope.$parent.settings.isDisabled = false;
                    scope.$apply();
                });

                handler.on('touchend', function () {
                    scope.$parent.settings.isDisabled = true;
                    scope.$apply();
                });

            }
        }
    };
}).directive('ngLazyClick', function ($parse) {
    return {
        compile: function ($element, attr) {
            var fn = $parse(attr.ngLazyClick);
            return function handler(scope, element) {
                element.on('click', function (event) {
                    scope.$apply(function () {
                        fn(scope, {$event: event});
                    });
                });
            };
        }
    };
});