angular.module('component.kanban-group', [
    'angularMoment',
    'component.glyph-icon'
]).directive('kanbanGroup', function () {
    return {
        templateUrl: 'app/component/kanban-group/kanban-group.html',
        link: function () {}
    };
});