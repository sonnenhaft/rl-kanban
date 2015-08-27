angular.module('component.layout-switcher', []).directive('layoutSwitcher', function ($location) {
    return {
        templateUrl: 'app/component/layout-switcher/layout-switcher.html',
        scope: true,
        link: function ($scope) {
            $scope.$watch('template', function (template) {
                if (template) {
                    $location.search('template', template);
                }
            });

            $scope.$watch('contentLevel', function (contentLevel) {
                if (contentLevel) {
                    $location.search('contentLevel', contentLevel);
                }
            });

            $scope.$watch('readOnly', function (readOnly) {
                if (readOnly) {
                    $location.search('readOnly', readOnly);
                }
            });

            $scope.$watch('empty', function (empty) {
                if (empty) {
                    $location.search('empty', empty);
                }
            });
        }
    };
}).controller('layoutSwitcherController', function ($location, $scope, plannerStub, workTrackerStub, plannerNoTasksStub, tasksDisplayFields, tasksDisplayFieldsWT, emptyPlanner) { //jshint ignore:line
    $scope.locationSearch = $location.search();
    var map = {
        wt: workTrackerStub,
        plannerNoTasksStub: plannerNoTasksStub,
        emptyPlanner: emptyPlanner
    };
    $scope.$watchCollection('locationSearch', function (locationSearch) {
        if (map[locationSearch.template]) {
            $scope.config = map[locationSearch.template];
        } else {
            $scope.config = plannerStub;
        }
        if (locationSearch.contentLevel) {
            if (locationSearch.template === 'wt') {
                $scope.config.settings.tasksDisplayFields = tasksDisplayFieldsWT[locationSearch.contentLevel];
            } else {
                $scope.config.settings.tasksDisplayFields = tasksDisplayFields[locationSearch.contentLevel];
            }
        }
        if (locationSearch.empty) {
            $scope.config.groups = [];
            $scope.config.tasks = [];
        }
        $scope.config.settings.readOnly = locationSearch.readOnly;
        $scope.config = angular.copy($scope.config);
    });
});