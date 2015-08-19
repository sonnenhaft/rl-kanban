angular.module('kanban.templates', []);
angular.module('kanban', [
    'component.kanban-model',
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
    'component.expand-collapse',
    'component.stickyHeader',
    'component.add-dropdown',
    'kanban-constant'
]).run(function($log, kanbanVersion, $http){
    if (kanbanVersion) {
        $log.debug('rl-kanban version: v' + kanbanVersion);
    } else {
        $http.get('./package.json').then(function(data){
            $log.debug('running dev, using version ' + data.data.version);
        })
    }
});

angular.module('kanban-constant', []).constant('kanbanVersion', false);
