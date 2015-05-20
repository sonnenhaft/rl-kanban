angular.module('component.kanban-group')
    .factory('kanbanGroupService', function () {
        var groups = {};
        return {
            registerGroup: function (id, groupScope) {
                groups[id] = groupScope;
            },
            getGroup: function (id) {
                return groups[id];
            },
            removeGroup: function (id) {
                if (groups[id]) {
                    delete groups[id];
                }
            }
        };
    });