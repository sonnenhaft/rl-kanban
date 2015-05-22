angular.module('kanban').factory('groupsRelationsHelper', function ($rootScope) {
    return {
        relateTasks: function (groups, tasks) {
            function removeTask(task) {
                var tasks = this.tasks;
                tasks.splice(tasks.indexOf(task), 1);
                if (tasks.length) {
                    var isLast = !tasks.some(function(task_) {
                        return task.columnId === task_.columnId;
                    });
                    if (isLast) {
                        var indexes = tasks.map(function(task){
                            return task.column.index;
                        }).sort(function(a,b){return a - b});
                        task.group.move(indexes[0], indexes[indexes.length - 1])
                    }
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
            }

            function highlightTasks(bool) {
                this.tasks.forEach(function(task){
                    task.highlight = bool;
                });
            }

            function move(start, end){
                this.start = start;
                this.width = end - start + 1;
            }

            groups.forEach(function (group) {
                group.removeTask = removeTask;
                group.move = move;
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