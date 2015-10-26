  angular.module('component.kanban-model').value('KanbanColumn', (function () {
    function KanbanColumn(columnData) {
        angular.extend(this, columnData);
    }

    KanbanColumn.prototype = {
        removeTask: function (task) {
            var index = this.tasks.indexOf(task);
            if (index !== -1) {
                this.tasks.splice(index, 1);
            }
            this.swimlane.$tasksCount--;
        }
    };
    return KanbanColumn;
})());