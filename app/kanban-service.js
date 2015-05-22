//TODO: remove this service, and add methods to tasks, groups and columns
angular.module('kanban').factory('kanbanService', function () {
    return {
        //spread: function (groupId, delta) {
        //    var cards = kanbanCardService.getCardsByGroupId(groupId),
        //        originalDelta = delta;
        //
        //
        //    angular.forEach(cards, function (card) {
        //        $timeout(function () {
        //            var itemData = card.itemData(),
        //                index = card.index(),
        //                columnIndex = card.sortableScope.index;
        //
        //            if (delta === 0) {
        //
        //                delta = originalDelta;
        //                return;
        //            }
        //
        //            if (kanbanColumnService.canMove(columnIndex + delta)) {
        //                kanbanColumnService.insertItem(columnIndex + delta, itemData);
        //                kanbanColumnService.removeItem(columnIndex, index);
        //                originalDelta < 0 ? delta++ : delta--;
        //            }
        //        });
        //    });
        //}
    };
});