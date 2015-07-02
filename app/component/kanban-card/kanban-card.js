angular.module('component.kanban-card').directive('kanbanCard', function (extendedCard) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope) {
            $scope.clickCallbacks = function(task, settings){
                extendedCard.open(task, settings);
                task.group.$highlightedGroup = true;
            }
        }
    };
});