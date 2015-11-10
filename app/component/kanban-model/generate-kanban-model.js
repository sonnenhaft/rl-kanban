angular.module('component.kanban-model').factory('generateKanbanModel', function (KanbanGroup, KanbanTask, KanbanColumn, KanbanSwimlane) {
    /*jshint maxcomplexity:10 */
    return function createKanbanModel(initialConfig) {
        var config = angular.copy(initialConfig);
        config.$loaded = false;

        if (angular.isDefined(initialConfig.tasks)) {
            angular.extend(config, {
                tasks: initialConfig.tasks.map(function (task) {
                    return new KanbanTask(task);
                })
            });
        }
        if (angular.isDefined(initialConfig.groups)) {
            angular.extend(config, {
                groups: initialConfig.groups.map(function (group) {
                    return new KanbanGroup(group);
                })
            });
        }
        if (angular.isDefined(initialConfig.columns)) {
            angular.extend(config, {
                columns: initialConfig.columns.map(function (column) {
                    return new KanbanColumn(column);
                })
            });
        }
        if (angular.isDefined(initialConfig.swimlanes)) {
            angular.extend(config, {
                swimlanes: initialConfig.swimlanes.map(function (swimlane) {
                    return new KanbanSwimlane(swimlane);
                })
            });
        }
        if (angular.isDefined(config.groups)) {
            config.groups.forEach(function (group) {
                group.tasks = [];
                group.tasks = config.tasks.filter(function (task) {
                    return task.groupId === group.id;
                });
                group.tasks.forEach(function (task) {
                    task.group = group;
                });
            });
        }
        if (angular.isDefined(config.columns)) {
            config.columns.forEach(function (column, index) {
                column.index = index;
            });
        }

        if (angular.isDefined(config.swimlanes)) {
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
        }

        if (angular.isDefined(config.groups)) {
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
        }

        config.$loaded = true;

        return config;
    };
});