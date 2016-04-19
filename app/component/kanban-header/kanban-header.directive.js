angular.module('component.kanban-header', [

]).directive('kanbanHeader', function () {
    return {
        templateUrl: 'app/component/kanban-header/kanban-header.html',
        scope: {
            columns: '=',
            groups: '=',
            settings: '='
        }
    };
});