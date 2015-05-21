angular.module('kanban').directive('kanban', function (groupsRelationsHelper, columnsRelationsHelper) {
    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        link: function ($scope) {
            var columns = $scope.config.columns;
            var groups = $scope.config.groups;

            columnsRelationsHelper.relateTasks(columns, $scope.config.tasks);
            groupsRelationsHelper.relateTasks(groups, $scope.config.tasks);
        }
    };
});