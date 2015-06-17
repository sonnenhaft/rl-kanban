angular.module('kanban').directive('kanban', function (KanbanColumn, KanbanTask, KanbanGroup) {
    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        link: function ($scope) {
            var tasks = $scope.config.tasks.map(function (task) {
                return new KanbanTask(task);
            });

            var columns = $scope.config.columns.map(function (column) {
                return new KanbanColumn(column);
            });

            $scope.groups = [];
            $scope.config.groups.forEach(function (group) {
                $scope.groups.push(new KanbanGroup(group, $scope.groups));
            });

            $scope.groups.forEach(function (group) {
                group.tasks = tasks.filter(function (task) {
                    return task.groupId === group.id;
                });
                group.tasks.forEach(function (task) {
                    task.group = group;
                });
            });

            $scope.config.swimlanes.forEach(function (swimlane) {
                swimlane.columns = angular.copy(columns);
                swimlane.columns.forEach(function (column) {
                    column.swimlane = swimlane;
                    column.tasks = tasks.filter(function (task) {
                        return task.columnId === column.id && task.swimlaneId === swimlane.id;
                    });
                    column.tasks.forEach(function (task) {
                        task.column = column;
                    });
                });
            });
            
            function rand(array) {
                return array[Math.round((Math.random() * (array.length - 1)))].id;
            }

            var index = 0;
            var groupsMap = {};
            $scope.groups.forEach(function (group) {
                groupsMap[group.id] = group;
            });
            var swimlanesMap = {};
            $scope.config.swimlanes.forEach(function (swimlanes) {
                swimlanesMap[swimlanes.id] = swimlanes;
            });
            $interval(function () {
                index++;
                var text = 'Random task ' + index;
                var task = angular.extend(angular.copy(tasks[0]), {
                    columnId: rand(columns),
                    groupId: rand($scope.groups),
                    swimlaneId: rand($scope.config.swimlanes),
                    id: '555b69112a241c792bd5db5d' + index,
                    description: text,
                    ownerName: text,
                    assigneeName: text,
                    appName: text,
                    taskName: text
                });
                task = new KanbanTask(task);
                task.group = groupsMap[task.groupId];
                var swimlane = swimlanesMap[task.swimlaneId];
                swimlane.columns.forEach(function (column) {
                    if (column.id === task.columnId) {
                        task.column = column;
                    }
                });
                task.group.tasks.push(task);
                task.column.tasks.push(task);

            }, 1000, 10);
        },
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
                angular.forEach(registeredElements, function (element) {
                    element.css('width', length * 228 + 'px');
                });
            });
        }
    };
});