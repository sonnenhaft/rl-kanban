angular.module('component.kanban-column').directive('kanbanColumn', function (kanbanColumnService) {
    return {
        link: function (scope, element, attrs) {
            scope.index = Number(attrs.kanbanColumn);
            kanbanColumnService.registerColumn(scope.index, scope);

            scope.isLastCard = function(groupId) {
                var isLast = true;
                angular.forEach(scope.modelValue, function(card){
                    if (groupId === card.groupId) {
                        isLast = false;
                    }
                });
                return isLast;
            };
        }
    };
});