angular.module('kanban').factory('columnsRelationsHelper', function () {
    return {
        relateTasks: function (columns, tasks) {
            function removeTask(task) {
                var tasks = this.tasks;
                tasks.splice(tasks.indexOf(task), 1);
            }

            function removeFromColumn() {
                this.column.removeTask(this);
            }

            columns.forEach(function (column) {
                column.removeTask = removeTask;
                column.tasks = tasks.filter(function (task) {
                    return task.columnId === column.id && task.swimlaneId === column.swimlane.id;
                });

                column.tasks.forEach(function (task) {
                    task.removeFromColumn = removeFromColumn;
                    task.column = column;
                });
            });
        }
    };
});
