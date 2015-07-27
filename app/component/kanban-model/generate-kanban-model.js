angular.module('component.kanban-model').factory('generateKanbanModel', function (KanbanGroup, KanbanTask, KanbanColumn) {
    return function createKanbanModel(initialConfig) {
        var config = angular.copy(initialConfig);
        angular.extend(config, {
            tasks: initialConfig.tasks.map(function (task) {
                return new KanbanTask(task);
            }),
            groups: initialConfig.groups.map(function (group) {
                return new KanbanGroup(group);
            }),
            columns: initialConfig.columns.map(function (column) {
                return new KanbanColumn(column);
            }),
            swimlanes: initialConfig.swimlanes.map(function (swimlane) {
                return angular.copy(swimlane);
            })
        });

        config.groups.forEach(function (group) {
            group.tasks = [];
            group.tasks = config.tasks.filter(function (task) {
                return task.groupId === group.id;
            });
            group.tasks.forEach(function (task) {
                task.group = group;
            });
        });

        config.columns.forEach(function (column, index) {
            column.index = index;
        });

        config.swimlanes.forEach(function (swimlane) {
            swimlane.columns = angular.copy(config.columns);
            swimlane.columns.forEach(function (column) {
                column.swimlane = swimlane;
                column.tasks = config.tasks.filter(function (task) {
                    return task.columnId === column.id && task.swimlaneId === swimlane.id;
                });
                column.tasks.forEach(function (task) {
                    task.column = column;
                });
            });
        });

        config.groups.forEach(function (group) {
            angular.extend(group, {
                visible: true,
                expanded: true,
                groupId: group.id,
                members: group.tasks
            });

            group.tasks.forEach(function (task) {
                angular.extend(task, {
                    createdDate: task.creationDate,
                    title: task.resourceName
                });
            });

            group.recalculate(true);
        });

        config.tasks = config.tasks.filter(function (task) {
            return task.group;
        });

        return config;
    };
});