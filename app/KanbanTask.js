angular.module('kanban').value('KanbanTask', (function () {
    function KanbanTask(taskData) {
        angular.extend(this, taskData);
    }

    KanbanTask.prototype = {
        removeFromColumn: function () {
            this.column.removeTask(this);
        },
        moveToColumn: function(column){
            this.column.tasks.splice(this.column.tasks.indexOf(this), 1);
            column.tasks.push(this);
            this.columnId = column.id;
            this.column = column;
        },
        removeFromGroup: function () {
            this.group.removeTask(this);
        }
    };

    return KanbanTask;
})());
