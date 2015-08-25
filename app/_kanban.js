angular.module('kanban.templates', []);
angular.module('kanban', [
    'component.kanban-model',
    'ngAnimate',
    'ngTouch',
    'component.scrollable-element',
    'kanban.templates',
    'component.kanban-board',
    'component.task-groups.task-groups-button',
    'component.add-new-control',
    //TODO: remove unused dependencies
    'ui.sortable',
    'mm.foundation',
    'component.task-groups.task-group',
    'component.task-groups.task-group-list',
    'component.groups-debug',
    'component.column-names',
    'component.swim-lane',
    'component.scroll-bar',
    'component.star-rating',
    'component.priority-level',
    'component.layout-switcher',
    'component.expand-collapse',
    'component.stickyHeader',
    'component.add-dropdown',
    'kanban-constant'
]).run(function($log, kanbanVersion){
    if (kanbanVersion) {
        $log.info('rl-kanban version: v' + kanbanVersion);
    }
});

angular.module('kanban-constant', []).constant('kanbanVersion', false);
