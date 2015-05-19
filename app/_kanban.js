angular.module('kanban.templates', []);
angular.module('kanban', [
    'component.scrollable-element',
    'kanban.templates',
    'ui.sortable',
    'mm.foundation',
    'component.kanban-card',
    'component.kanban-group',
    'component.kanban-column',
    'component.draggable-label',
    'component.draggable-labels-control',
    'ngTouch'
]).run(function($rootScope){
    $rootScope.groups = [
        {name: 'Task Group Name 1', start: 0, width: 2, index: 0},
        {name: 'Task Group Name 2', start: 1, width: 5, index: 1},
        {name: 'Task Group Name 3', start: 22, width: 2, index: 2},
        {name: 'Task Group Name 4', start: 0, width: 7, index: 3}
    ];
});
