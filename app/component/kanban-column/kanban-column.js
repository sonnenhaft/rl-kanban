angular.module('component.kanban-column').directive('kanbanColumn', function () {
    return {
        link: function (scope, element, attrs) {
            scope.index = Number(attrs.kanbanColumn);
        }
    };
});