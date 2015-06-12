angular.module('kanban').value('KanbanGroup', (function () {
    function KanbanGroup(groupData, parentCollection) {
        angular.extend(this, groupData);
        this.groups = parentCollection;
    }

    KanbanGroup.prototype = {
        highlightTasks: function (bool) {
            this.tasks.forEach(function (task) {
                task.$highlight = bool;
            });
        },
        shrink: function (delta) {
            angular.forEach(this.tasks, function (task) {
                var toColumn = task.column.swimlane.columns[task.column.index + delta];
                task.column.tasks.splice(task.column.tasks.indexOf(task), 1);
                toColumn.tasks.push(task);
                task.column = toColumn;
                task.columnId = task.column.id;
            });
        },
        expand: function () {
            var start = this.start;
            var width = this.width;
            var numberOfTasks = this.tasks.length;
            var columnAmount = Math.ceil(numberOfTasks / width);
            angular.forEach(this.tasks, function (task) {
                var toColumn = task.column.swimlane.columns[start];
                task.column.tasks.splice(task.column.tasks.indexOf(task), 1);
                toColumn.tasks.push(task);
                task.column = toColumn;
                task.columnId = task.column.id;
                columnAmount--;
                numberOfTasks--;
            });
        },
        recalculate: function () {
            var min = this.tasks[0].column.index;
            var max = min;
            var index;
            angular.forEach(this.tasks, function (task) {
                index = task.column.index;
                if (index < min) {
                    min = index;
                } else if (index > max) {
                    max = index;
                }
            });
            this.start = min;
            this.width = max - min + 1;
        },

        //attention, next 2 methods uses groups collection
        removeTask: function (task) {
            task.column.tasks.splice(task.column.tasks.indexOf(task), 1);
            task.column.swimlane.$tasksCount--;
            if (this.tasks.length) {
                task.group.recalculate();
            } else {
                this.groups.splice(this.groups.indexOf(task.group), 1);
            }
        },

        remove: function () {
            this.groups.splice(this.groups.indexOf(this), 1).sort(function (group1, group2) {
                return group1.index > group2.index ? 1 : -1;
            }).forEach(function (group, index) {
                group.index = index;
            });
            this.tasks.forEach(function (task) {
                task.removeFromGroup();
            });
        }
    };

    return KanbanGroup;
})());
