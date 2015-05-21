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
                var cards = kanbanCardService.getCardsByGroupId(groupId);
                var originalDelta = delta;

                cards.forEach(function (card) {
                    $timeout(function () {
                        var itemData = card.itemData();
                        var index = card.index();
                        var columnIndex = card.sortableScope.index;

                        if (!delta) {
                            delta = originalDelta;
                        } else if (kanbanColumnService.canMove(columnIndex + delta)) {
                            kanbanColumnService.insertItem(columnIndex + delta, itemData);
                            kanbanColumnService.removeItem(columnIndex, index);
                            originalDelta < 0 ? delta++ : delta--;
                        }
                    });
                });
            },
            itemMoved: function (event) {
                var card = event.source.itemScope.task,
                    group = kanbanGroupService.getGroup(card.groupId),
                    fromColumn = event.source.sortableScope.index,
                    toColumn = event.dest.sortableScope.index,
                    groupX = group.getGroupPosition();

                if ((groupX.start === fromColumn) && (toColumn > groupX.start) || (groupX.end === fromColumn) && (groupX.end > toColumn)) {
                    var index = fromColumn;
                    var isLast = kanbanColumnService.getColumn(fromColumn).isLastCard(card.groupId);

                    while (isLast) {
                        fromColumn > toColumn ? index-- : index++;
                        isLast = kanbanColumnService.getColumn(index).isLastCard(card.groupId);
                    }
                    fromColumn > toColumn ? group.setEnd(index) : group.setStart(index);

                }
                group.checkPosition(fromColumn, toColumn);
            }
        };
    });