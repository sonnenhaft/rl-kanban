angular.module('component.kanban-card')
    .factory('kanbanCardService', function () {
        var cards = {};
        return {
            registerCard: function (id, cardScope) {
                cards[id] = cardScope;
            },
            getCard: function (id) {
                return cards[id];
            },
            getCardsByGroupId: function (groupId) {
                var selected = [];
                angular.forEach(cards, function (cardScope) {
                    if (angular.equals(groupId, cardScope.task.groupId)) {
                        selected.push(cardScope);
                    }
                });
                return selected;
            }
        };
    });