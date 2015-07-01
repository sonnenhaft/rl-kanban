  angular.module('component.kanban-model').value('KanbanColumn', (function () {
    function KanbanColumn(columnData) {
        angular.extend(this, columnData);
    }

    KanbanColumn.prototype = {
        removeTask: function (task) {
            this.tasks.splice(this.tasks.indexOf(task), 1);
            this.swimlane.$tasksCount--;
        }
    };
    return KanbanColumn;
})());