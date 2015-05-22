angular.module('kanban').factory('columnsRelationsHelper', function () {
    return {
        relateTasks: function (columns, tasks) {
            columns.forEach(function (column) {
                column.tasks = tasks.filter(function (task) {
                    return task.columnId === column.id;
                });

                column.tasks.forEach(function (task) {
                    task.column = column;
                    task.columns = columns;
                });
            });
        }
    };
});
