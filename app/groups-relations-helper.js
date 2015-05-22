angular.module('kanban').factory('groupsRelationsHelper', function () {
    return {
        relateTasks: function (groups, tasks) {
            function removeTask(task) {
                var tasks = this.tasks;
                tasks.splice(tasks.indexOf(task), 1);
                if (tasks.length) {
                    task.group.recalculate();
                } else {
                    groups.splice(groups.indexOf(task.group), 1);
                }
            }

            function removeFromGroup() {
                this.group.removeTask(this);
            }

            function removeGroup() {
                groups.splice(groups.indexOf(this), 1);
                groups.sort(function (group1, group2) {
                    return group1.index > group2.index ? 1 : -1;
                }).forEach(function(group, index){
                    group.index = index;
                });
                angular.forEach(this.tasks, function (task) {
                    task.column.tasks.splice(task.column.tasks.indexOf(task), 1);
                });
            }

            function highlightTasks(bool) {
                this.tasks.forEach(function(task){
                    task.highlight = bool;
                });
            }

            function recalculate(){
                var min = this.tasks[0].column.index;
                var max = min;
                var index;
                angular.forEach(this.tasks, function(task){
                    index = task.column.index;
                    if (index < min) {
                        min = index;
                    } else if (index > max) {
                        max = index;
                    }
                });
                this.start = min;
                this.width = max - min + 1;
            }

            function shift(delta) {
                angular.forEach(this.tasks, function (task) {
                    var toColumn = task.columns[task.column.index + delta];
                    task.column.tasks.splice(task.column.tasks.indexOf(task), 1);
                    toColumn.tasks.push(task);
                    task.column = toColumn;
                    task.columnId = task.column.id;
                });
            }

            groups.forEach(function (group) {
                group.removeTask = removeTask;
                group.recalculate = recalculate;
                group.shift = shift;
                group.tasks = tasks.filter(function (task) {
                    return task.groupId === group.id;
                });
                group.tasks.forEach(function (task) {
                    task.group = group;
                    task.removeFromGroup = removeFromGroup;
                });

                group.remove = removeGroup;
                group.highlightTasks = highlightTasks;
            });
        }
    };
});