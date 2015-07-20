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
            column.tasks.push(this);
            this.columnId = column.id;
            this.swimlaneId = column.swimlaneId;
            column.swimlane.$tasksCount++;
        },
        removeFromColumn: function () {
            this.column.removeTask(this);
        },
        moveToColumn: function(column){
            if (column === this.column) {
                return;
            }
            $rootScope.$broadcast('kanban:task:moved', this.id, this.column.id, column.id);
            this.column.tasks.splice(this.column.tasks.indexOf(this), 1);
            column.tasks.push(this);
            this.columnId = column.id;
            this.column = column;
        },
        remove: function(){
            this.removeFromColumn();
            this.group.tasks.splice(this.group.tasks.indexOf(this), 1);
            this.group.recalculate();
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
