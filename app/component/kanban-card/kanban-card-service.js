angular
    .module('component.scrollable-element')
    .factory('kanbanGroupService', function () {
        var groups = {};
        return {
            registerGroup: function (id, groupScope) {
                groups[id] = groupScope;
            },
            getGroup: function (id) {
                return groups[id];
            }
        };
    });