angular.module('component.kanban-group').directive('kanbanGroup', function (kanbanGroupService, kanbanCardService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'app/component/kanban-group/kanban-group.html',
        scope: {
            group: '='
        },
        link: function (scope, element) {
            kanbanGroupService.registerGroup(scope.group.groupId, scope);

            scope.removeItem = function (){
                var cards;
                $timeout(function () {
                    cards = kanbanCardService.getCardsByGroupId(scope.group.groupId);
                    angular.forEach(cards, function (card) {
                        $timeout(function () {
                            card.sortableScope.removeItem(card.index());
                        })
                    });
                    element.remove();
                });
            }
        }
    };
});