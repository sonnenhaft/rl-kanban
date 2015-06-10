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
        }
    };

    return KanbanTask;
})());
