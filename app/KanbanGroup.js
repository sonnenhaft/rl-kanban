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
            var swimLanes = {};
            this.tasks.forEach(function(task){
                if (!swimLanes[task.column.swimlane.id]){
                    swimLanes[task.column.swimlane.id] = [task];
                } else {
                    swimLanes[task.column.swimlane.id].push(task);
                }
            });

            var start = this.start;
            var end = this.width;
            angular.forEach(swimLanes, function(tasks){
                tasks.forEach(function(task, index){
                    task.moveToColumn(task.column.swimlane.columns[start + index % end]);
                });
            });
        },
        recalculate: function () {
            var minIndex = Number.MAX_VALUE;
            var maxIndex = 0;
            this.tasks.forEach(function (task) {
                var columnIndex = task.column.index;
                if (columnIndex > maxIndex) {
                    maxIndex = columnIndex;
                }
                if (columnIndex < minIndex) {
                    minIndex = columnIndex;
                }
            });
            this.start = minIndex;
            this.width = maxIndex - minIndex + 1;
            this.$recalculated = true;
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
