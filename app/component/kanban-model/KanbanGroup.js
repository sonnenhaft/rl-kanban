angular.module('component.kanban-model').factory('KanbanGroup', function () {
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
            this.tasks.forEach(function (task) {
                task.moveToColumn(task.column.swimlane.columns[task.column.index + delta], true);
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
                    task.moveToColumn(task.column.swimlane.columns[start + index % end], true);
                });
            });
        },
        recalculate: function (skipFlag) {
            if (this.tasks.length) {
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
            }

            if (!skipFlag) {
                this.$recalculated = true;
            }
        },
        remove: function(){
            this.tasks.forEach(function(task){
               task.removeFromColumn();
            });
        }
    };

    return KanbanGroup;
});
