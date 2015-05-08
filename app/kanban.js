angular.module('kanban').directive('kanban', function () {
    return {
        templateUrl: 'app/kanban.html',
        scope: {board: '='}
    };
});
