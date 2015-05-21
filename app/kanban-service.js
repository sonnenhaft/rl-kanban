angular.module('kanban')
    .factory('kanbanService', function ($timeout, kanbanCardService, kanbanColumnService, kanbanGroupService) {
        return {
            shift: function (groupId, delta) {
                var cards = kanbanCardService.getCardsByGroupId(groupId);
                angular.forEach(cards, function (card) {
                    $timeout(function () {
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
            spread: function (groupId, delta) {
                var cards = kanbanCardService.getCardsByGroupId(groupId),
                    originalDelta = delta;


                angular.forEach(cards, function (card) {
                    $timeout(function () {
                        var itemData = card.itemData(),
                            index = card.index(),
                            columnIndex = card.sortableScope.index;

                        if (delta === 0) {

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
            },
            itemMoved: function (event) {
                var groupId = event.source.itemScope.task.groupId,
                    fromColumn = event.source.sortableScope.index,
                    toColumn = event.dest.sortableScope.index,
                    group = kanbanGroupService.getGroup(groupId),
                    groupX = group.getGroupPosition();

                if ((groupX.start === fromColumn) && (toColumn > groupX.start) || (groupX.end === fromColumn) && (groupX.end > toColumn)) {
                    var index = fromColumn,
                        isLast = kanbanColumnService.getColumn(fromColumn).isLastCard(groupId);
                    
                    while (isLast) {
                        fromColumn > toColumn ? index-- : index++;
                        isLast = kanbanColumnService.getColumn(index).isLastCard(groupId);
                    }
                    fromColumn > toColumn ? group.setEnd(index) : group.setStart(index);

                }
                group.checkPosition(fromColumn, toColumn);
            }
        };
    });