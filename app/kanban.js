angular.module('kanban').directive('kanban', function (KanbanColumn, KanbanTask, KanbanGroup) {
    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        link: function ($scope) {
            $scope.tasks = $scope.config.tasks.map(function(task) {
                return new KanbanTask(task);
            });

            $scope.columns = $scope.config.columns.map(function(column){
                return new KanbanColumn(column);
            });

            $scope.groups = [];
            $scope.config.groups.forEach(function(group){
                $scope.groups.push(new KanbanGroup(group, $scope.groups));
            });

            $scope.groups.forEach(function (group) {
                group.tasks = $scope.tasks.filter(function (task) {
                    return task.groupId === group.id;
                });
                group.tasks.forEach(function (task) {
                    task.group = group;
                });
            });

            $scope.config.swimlanes.forEach(function (swimlane) {
                swimlane.columns = angular.copy($scope.columns);
                swimlane.columns.forEach(function (column) {
                    column.swimlane = swimlane;
                    column.tasks = $scope.tasks.filter(function (task) {
                        return task.columnId === column.id && task.swimlaneId === swimlane.id;
                    });
                    column.tasks.forEach(function (task) {
                        task.column = column;
                    });
                });
            });
        },
        controller: function ($scope) {
            var registeredElements = [];
            this.registerElement = function (childElement) {
                registeredElements.push(childElement);
                childElement.css('width', $scope.config.columns.length * 228 + 'px');
            };

            this.removeElement = function(childElement) {
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