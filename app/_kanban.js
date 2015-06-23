angular.module('kanban.templates', []);
angular.module('kanban', [
    'ngAnimate',
    'ngTouch',
    'component.scrollable-element',
    'kanban.templates',
    'component.kanban-board',
    'component.task-groups-button',
    'component.add-new-control',
    //TODO: remove unused dependencies
    'ui.sortable',
    'mm.foundation',
    'component.task-group',
    'component.task-group-list',
    'component.groups-debug',
    'component.column-names',
    'component.swim-lane',
    'component.scroll-bar',
    'component.star-rating',
    'component.priority-level',
    'component.layout-switcher',
    'component.stickyHeader'
]);
