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
        },
        collapse: function () {
            this.$collapsed = true;
            this.$disabled = true;
        },
        expand: function () {
            this.$collapsed = false;
            this.$disabled = false;
        }
    };

    return KanbanColumn;

})());