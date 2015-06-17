angular.module('kanban').value('KanbanTask', (function () {
    function KanbanTask(taskData) {
        angular.extend(this, taskData);
    }

    KanbanTask.prototype = {
        removeFromColumn: function () {
            this.column.removeTask(this);
        },
        removeFromGroup: function () {
            this.group.removeTask(this);
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
