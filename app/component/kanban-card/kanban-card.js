angular.module('component.kanban-card', [
    'angularMoment',
    'component.glyph-icon'
]).directive('kanbanCard', function () {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        link: function ($scope, $element, $attrs) {

        }
    };
});