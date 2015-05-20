angular.module('kanban')
    .factory('kanbanService', function ($timeout, kanbanCardService, kanbanColumnService) {
        var columns = {};
        return {
            shift: function (groupId, delta) {
                var cards = kanbanCardService.getCardsByGroupId(groupId);
                angular.forEach(cards, function (card) {
                    $timeout(function(){
                        var itemData = card.itemData(),
                            index = card.index(),
                            columnIndex = card.sortableScope.index;

                        if (kanbanColumnService.canMove(columnIndex + delta)) {
                            kanbanColumnService.insertItem(columnIndex + delta, itemData);
                            kanbanColumnService.removeItem(columnIndex, index);
                        }
                    });
                });
            },
            spread: function(groupId, delta, length){
                var cards = kanbanCardService.getCardsByGroupId(groupId),
                    originalDelta = delta,
                    max = length + delta;

                angular.forEach(cards, function (card) {
                    $timeout(function(){
                        var itemData = card.itemData(),
                            index = card.index(),
                            columnIndex = card.sortableScope.index;

                        if (steps === 0) {
                            delta = originalDelta;
                            return;
                        }

                        if (kanbanColumnService.canMove(columnIndex + delta)) {
                            kanbanColumnService.insertItem(columnIndex + delta, itemData);
                            kanbanColumnService.removeItem(columnIndex, index);
                            originalDelta < 0 ? delta++ : delta--;
                        }
                    });
                });
            }
        };
    });