angular.module('component.kanban-group', [
    'angularMoment',
    'component.glyph-icon'
]).directive('kanbanGroup', function (kanbanGroupService) {
    return {
        templateUrl: 'app/component/kanban-group/kanban-group.html',
        require: 'ngModel',
        scope: {
            group: '='
        },
        link: function ($scope) {
            kanbanGroupService.registerGroup($scope.group.id, $scope);
        }
    };
});