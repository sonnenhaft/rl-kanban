angular.module('kanban').directive('kanban', function (groupsRelationsHelper, columnsRelationsHelper, swimlanesRelationsHelper) {
    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        link: function ($scope) {
            var columns = $scope.config.columns;
            var groups = $scope.config.groups;
            var swimlanes = $scope.config.swimlanes;

            swimlanesRelationsHelper.relateColumns(swimlanes, columns);
            groupsRelationsHelper.relateTasks(groups, $scope.config.tasks);

            angular.forEach(swimlanes, function (swimlane) {
                columnsRelationsHelper.relateTasks(swimlane.columns, $scope.config.tasks);
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