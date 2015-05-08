angular.module('kanban').directive('kanban', function (windowScrollService) {
    var scrollCallbacks = {
        dragStart: windowScrollService.watchMouse,
        dragEnd: windowScrollService.stopWatching
    };

    return {
        templateUrl: 'app/kanban.html',
        scope: {board: '='},
        link: function ($scope) {
            $scope.scrollCallbacks = scrollCallbacks;
        }
    };
});
