angular.module('component.kanban-group').directive('kanbanGroup', function (kanbanService, kanbanGroupService, kanbanCardService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'app/component/kanban-group/kanban-group.html',
        scope: {
            group: '='
        },
        link: function (scope, element) {
            kanbanGroupService.registerGroup(scope.group.id, scope);

            scope.removeItem = function (){
                var cards;
                $timeout(function () {
                    cards = kanbanCardService.getCardsByGroupId(scope.group.id);
                    angular.forEach(cards, function (card) {
                        $timeout(function () {
                            card.sortableScope.removeItem(card.index());
                        });
                    });
                    element.remove();
                });
            };

            var index = 0;
            scope.shift = function(delta){
                kanbanService.shift(scope.group.id, index, index + delta);
            };
        }
    };
});