angular.module('kanban').directive('kanban', function () {
    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        controller: function ($scope) {
            var registeredElements = [];
            this.registerElement = function (childElement) {
                registeredElements.push(childElement);
                childElement.css('width', $scope.config.columns.length * 228 + 'px');
            };

            this.removeElement = function (childElement) {
                registeredElements.splice(registeredElements.indexOf(childElement), 1);
            };

            $scope.$watch('config.columns.length', function (length) {
                registeredElements.forEach(function (element) {
                    element.css('width', length * 228 + 'px');
                });
            });
        }
    };
}).controller('kanbanDataController', function ($scope, hostedStub, KanbanTask, KanbanGroup, KanbanColumn) {

    var config = {
        tasks: hostedStub.tasks.map(function (task) {
            return new KanbanTask(task);
        }),
        groups: hostedStub.groups.map(function (group) {
            return new KanbanGroup(group);
        }),
        columns: hostedStub.columns.map(function (column) {
            return new KanbanColumn(column);
        }),
        swimlanes: hostedStub.swimlanes
    };

    config.groups.forEach(function (group) {
        group.tasks = config.tasks.filter(function (task) {
            return task.groupId === group.id;
        });
        group.tasks.forEach(function (task) {
            task.group = group;
        });
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
                title: task.description
            });
        });
    });

    config.tasks = config.tasks.filter(function (task) {
        return task.group;
    });

    var firstColumn = config.swimlanes[0].columns[0];
    $scope.$on('addToGroup', function (e, group, task) {
        task = new KanbanTask(task);
        task.attachToGroup(group);
        task.attachToColumn(firstColumn);
        config.tasks.push(task);
        task.taskName = task.title.text;
        group.recalculate();
    });

    $scope.config = config;
});