angular.module('component.kanban-model').value('KanbanSwimlane', (function () {
    function KanbanSwimlane(swimlaneData) {
        angular.extend(this, swimlaneData);
    }

    KanbanSwimlane.prototype = {
        edit: function () {
            this.$edit = true;
            this.$disabled = true;
            this.columns.forEach(function (column) {
                column.tasks.forEach(function (task) {
                    task.$edit = true;
                    task.$highlight = false;
                });
            });
        },
        cancelEdit: function () {
            this.$edit = false;
            this.$disabled = false;
            this.columns.forEach(function (column) {
                column.tasks.forEach(function (task) {
                    task.$edit = false;
                });
            });
        }
    };

    return KanbanSwimlane;

})());