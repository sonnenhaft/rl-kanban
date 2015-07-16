angular.module('component.layout-switcher', []).directive('layoutSwitcher', function ($location) {
    return {
        templateUrl: 'app/component/layout-switcher/layout-switcher.html',
        scope: true,
        link: function ($scope) {
            $scope.$watch('template', function (template) {
                $location.search('template', template);
            });

            $scope.$watch('contentLevel', function (contentLevel) {
                $location.search('contentLevel', contentLevel);
            });

            $scope.$watch('readOnly', function (readOnly) {
                $location.search('readOnly', readOnly);
            });

            $scope.$watch('empty', function (empty) {
                $location.search('empty', empty);
            });
        }
    };
}).controller('layoutSwitcherController', function ($location, $scope, plannerStub, workTrackerStub, plannerNoTasksStub, tasksDisplayFields, tasksDisplayFieldsWT) {
    $scope.locationSearch = $location.search();
    $scope.$watchCollection('locationSearch', function (locationSearch) {
        if (locationSearch.template === 'wt') {
            $scope.config = workTrackerStub;
        } else if(locationSearch.template === 'plannerNoTasksStub') {
            console.log('no tasks')
            $scope.config = plannerNoTasksStub;
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