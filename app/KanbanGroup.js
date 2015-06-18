angular.module('kanban').value('KanbanGroup', (function () {
    function KanbanGroup(groupData) {
        angular.extend(this, groupData);
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
        remove: function(){
            this.tasks.forEach(function(task){
               task.removeFromColumn();
            });
        }
    };

    return KanbanGroup;
})());
