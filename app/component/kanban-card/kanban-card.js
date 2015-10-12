angular.module('component.kanban-card').directive('kanbanCard', function (extendedCard, $timeout, isTouch) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope, $element) {
            var modal;
            $scope.clickCallbacks = function (task, settings, $event, force) {
                $event.stopImmediatePropagation();
                if (settings.legacyCardModal && !force) {
                    $scope.$emit('kanban:task:modalopen', task);
                    return;
                }
                modal = extendedCard.open(task, settings);
                modal.result.finally(function(){
                    modal = null;
                });
            };

            $scope.$on('$destroy', function(){
                if (modal) {modal.dismiss('cancel');}
            });

            if (isTouch) {
                //TODO: remove parent from here, STOP merging scopes
                $scope.$parent.settings.isDisabled = true;

                var timeout = null;
                $element.on('touchstart', function () {
                    timeout = $timeout(function () {
                        $scope.$parent.settings.isDisabled = false;
                    }, 500);
                }).on('touchend', function () {
                    $scope.$parent.settings.isDisabled = true;
                    $timeout.cancel(timeout);
                });

                angular.element($element[0].getElementsByClassName('card-handle')[0]).on('touchstart', function () {
                    $scope.$parent.settings.isDisabled = false;
                    $scope.$apply();
                }).on('touchend', function () {
                    $scope.$parent.settings.isDisabled = true;
                    $scope.$apply();
                });
            }
        }
    };
}).directive('ngLazyClick', function ($parse) {
    return {
        compile: function ($element, $attr) {
            var fn = $parse($attr.ngLazyClick);
            return function ($scope, $element) {
                $element.on('click', function ($event) {
                    $scope.$apply(function () {fn($scope, {$event: $event});});
                });
            };
        }
    };
});