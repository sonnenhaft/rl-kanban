angular.module('kanban').factory('groupsRelationsHelper', function () {
    return {
        relateTasks: function (groups, tasks) {
            function removeTask(task) {
                var tasks = this.tasks;
                tasks.splice(tasks.indexOf(task), 1);
                if (!tasks.length) {
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

            groups.forEach(function (group) {
                group.removeTask = removeTask;
                group.tasks = tasks.filter(function (task) {
                    return task.groupId === group.id;
                });
                group.tasks.forEach(function (task) {
                    task.group = group;
                    task.removeFromGroup = removeFromGroup;
                });

                group.remove = removeGroup;
            });
        }
    };
});