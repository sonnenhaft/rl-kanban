angular.module('kanban.templates', []);
angular.module('kanban', [
    'component.scrollable-element',
    'kanban.templates',
    'ui.sortable',
    'mm.foundation',
    'component.kanban-card',
    'component.task-group-control'
]);
