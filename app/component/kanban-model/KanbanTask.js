angular.module('component.kanban-model').factory('KanbanTask', function ($rootScope) {
    var uniqueId = 0;
    function KanbanTask(taskData) {
        angular.extend(this, taskData);
        this.$uniqueId = uniqueId++;
    }

    KanbanTask.prototype = {
        attachToGroup: function(group){
            group.tasks.push(this);
            this.group = group;
            this.groupId = group.id;
        },
        attachToColumn: function(column){
            this.column = column;
            if (column.tasks.indexOf(this) === -1) {
                column.tasks.push(this);
            }
            this.columnId = column.id;
            this.swimlaneId = column.swimlaneId;
            column.swimlane.$tasksCount++;
            if (angular.isDefined(this.group)) {
                this.group.recalculate();
            }
        },
        removeFromColumn: function () {
            this.column.removeTask(this);
            return this;
        },
        moveToColumn: function(column){
            if (column === this.column) {
                return;
            }
            $rootScope.$broadcast('kanban:task:moved', this.id, this.column.id, column.id, this.column.swimlane.id, column.swimlane.id);

            this.removeFromColumn().attachToColumn(column);
        },
        replace: function(newTaskData) {
            var clonedTask = new KanbanTask(this);
            angular.extend(clonedTask, newTaskData);
            this.column.tasks[this.column.tasks.indexOf(this)] = clonedTask;
            if (this.group) {
                this.group.tasks[this.group.tasks.indexOf(this)] = clonedTask;
            }
            this.$$remove();
            return clonedTask;
        },
        $$remove: function(){
            this.group = undefined;
            this.column = uniqueId;
        },
        remove: function(){
            this.removeFromColumn();
            this.column = uniqueId;
            if (this.group) {
                this.group.tasks.splice(this.group.tasks.indexOf(this), 1);
                this.group.recalculate();
            }
            this.$$remove();
            return this;
        },
        clone: function () {
            var clonedTask = new KanbanTask(this);
            clonedTask.taskName += ' (Copy)';
            if (this.group) {
                this.group.tasks.push(clonedTask);
            }
            this.column.tasks.push(clonedTask);
            this.column.swimlane.$tasksCount++;
            return clonedTask;
        }
    };

    return KanbanTask;
});
