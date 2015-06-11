angular.module('kanban.templates', []);
angular.module('kanban', [
    'ngAnimate',
    'ngTouch',
    'component.scrollable-element',
    'kanban.templates',
    'component.kanban-board',
    //TODO: remove unused dependencies
    'ui.sortable',
    'mm.foundation',
    'component.kanban-group',
    'component.kanban-column',
    'component.draggable-label',
    'component.draggable-labels-control',
    'component.groups-debug',
    'component.column-names',
    'component.swim-lane',
    'component.scroll-bar',
    'component.star-rating',
    'component.priority-level',
    'component.layout-switcher'
]);
