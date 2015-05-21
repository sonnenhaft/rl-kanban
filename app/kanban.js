angular.module('kanban').directive('kanban', function (kanbanService) {
    return {
        templateUrl: 'app/kanban.html',
        require: '^scrollableElement',
        scope: {board: '='},
        replace: true,
        link: function ($scope, element, attrs, scrollableElement) {
            $scope.columns = $scope.board.columns;
            $scope.groups = $scope.board.groups;
            $scope.scrollCallbacks = {
                dragStart: scrollableElement.watchMouse,
                dragEnd: scrollableElement.stopWatching,
                itemMoved: kanbanService.itemMoved,
                containment: '.cards-container',
                scrollableContainer: '.kanban-row'
            };

            $scope.columns.forEach(function (column) {
                column.tasks = $scope.board.tasks.filter(function (task) {
                    return task.columnId === column.id;
                });

                column.tasks.forEach(function(task){
                    task.column = column;
                });
            });

            $scope.groups.forEach(function (group) {
                group.tasks = $scope.board.tasks.filter(function (task) {
                    return task.groupId === group.id;
                });
                group.tasks.forEach(function(task){
                    task.group = group;
                });
            });

            $scope.$on('group-removed', function(e, task){
                var tasks = task.group.tasks;
                tasks.splice(tasks.indexOf(task), 1);
                if (!tasks.length) {
                    $scope.groups.splice($scope.groups.indexOf(task.group), 1);
                }
            });
        }
    };
});
