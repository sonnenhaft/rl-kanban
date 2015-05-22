//TODO: remove this service, and add methods to tasks, groups and columns
angular.module('kanban').factory('kanbanService', function ($timeout, kanbanCardService, kanbanColumnService) {
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
            var task = event.source.itemScope.task;
            var fromColumn = event.source.sortableScope.index;
            var toColumn = event.dest.sortableScope.index;
            task.column = task.columns[toColumn];
            task.columnId = task.column.Id;

            var group = task.group;
            var end = group.start + group.width - 1;

            function setWidth(start, width) {
                group.start = start;
                group.width = width;
            }

            if ((group.start === fromColumn) && (toColumn > group.start) || (end === fromColumn) && (end > toColumn)) {
                var index = fromColumn,
                    isLast = kanbanColumnService.getColumn(fromColumn).isLastCard(group.id);

                while (isLast) {
                    fromColumn > toColumn ? index-- : index++;
                    isLast = kanbanColumnService.getColumn(index).isLastCard(group.id);
                }
                fromColumn > toColumn ? setWidth(group.start, index - group.start + 1) : setWidth(index, group.start + group.width - index);
            }

            if (group.start > toColumn) {
                setWidth(toColumn, group.start - toColumn + group.width);
            } else if (group.start + group.width - 1 < toColumn) {
                setWidth(group.start, toColumn - group.start + 1);
            }

        }
    };
});