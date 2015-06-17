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
        clone: function (task) {
            task.taskName += ' (Copy)';
            task = new KanbanTask(task);
            task.group.tasks.push(task);
            task.column.tasks.push(task);
            task.column.swimlane.$tasksCount++;
        }
    };

    return KanbanTask;
})());
