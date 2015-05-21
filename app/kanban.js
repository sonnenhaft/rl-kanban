angular.module('kanban').directive('kanban', function () {
    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        link: function ($scope) {
            var columns = $scope.config.columns;
            var groups = $scope.config.groups;

            columns.forEach(function (column) {
                column.tasks = $scope.config.tasks.filter(function (task) {
                    return task.columnId === column.id;
                });

                column.tasks.forEach(function (task) {
                    task.column = column;
                });
            });

            function removeTask(task) {
                var tasks = this.tasks;
                tasks.splice(tasks.indexOf(task), 1);
                if (!tasks.length) {
                    groups.splice(groups.indexOf(task.group), 1);
                }
            }

            function removeFromGroup(){
                this.group.removeTask(this);
            }

            groups.forEach(function (group) {
                group.removeTask = removeTask;
                group.tasks = $scope.config.tasks.filter(function (task) {
                    return task.groupId === group.id;
                });
                group.tasks.forEach(function (task) {
                    task.group = group;
                    task.removeFromGroup = removeFromGroup;
                });
            });
        }
    };
});
