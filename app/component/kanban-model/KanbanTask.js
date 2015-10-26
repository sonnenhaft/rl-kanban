angular.module('component.kanban-model').factory('KanbanTask', function ($rootScope) {
    function KanbanTask(taskData) {
        angular.extend(this, taskData);
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

            this.removeFromColumn()
                .attachToColumn(column);
        },
        remove: function(){
            this.removeFromColumn();
            if (angular.isDefined(this.group)) {
                this.group.tasks.splice(this.group.tasks.indexOf(this), 1);
                this.group.recalculate();
            }
        },
        clone: function (task) {
            var clonedTask = new KanbanTask(task);
            clonedTask.taskName += ' (Copy)';
            task.group.tasks.push(clonedTask);
            task.column.tasks.push(clonedTask);
            task.column.swimlane.$tasksCount++;
        }
    };

    return KanbanTask;
});
