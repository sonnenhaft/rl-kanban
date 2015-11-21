angular.module('demo-code.layout-switcher').controller('LayoutSwitcherDemoController', function ($location, $scope, mockGetter, $modal, $q) {
    $scope.locationSearch = $location.search();

    $scope.$watchCollection('locationSearch', function (locationSearch) {
        $q.all({
            layout: mockGetter.getLayout(locationSearch.layout || 'work-tracker'),
            contentLevel: mockGetter.getContentLevel(/work-tracker/i.test(locationSearch.layout) ? 'work-tracker' : 'planner')
        }).then(function (result) {

            $scope.config = angular.copy(result.layout);

            if (locationSearch.contentLevel) {
                $scope.config.settings.tasksDisplayFields = result.contentLevel[locationSearch.contentLevel];
            }

            if (locationSearch.empty) {
                $scope.config.groups = [];
                $scope.config.tasks = [];
            }

            if ($scope.config.settings) {
                $scope.config.settings.readOnly = locationSearch.readOnly;
            }
        });
    });

    $scope.$on('kanban:task:moved', function ($event, taskId) {
        var columnId = '555b6911ba6d349f6253cd85';
        $scope.kanbanModel.tasks.forEach(function (task) {
            if (task.id === taskId && task.validStates) {
                task.validStates.push(columnId);
            }
        });
    });

    $scope.$on('kanban:task:modalopen', function () {
        $modal.open({
            windowClass: 'tiny task-card-modal-demo',
            templateUrl: 'app/demo-code/layout-switcher/demo-modal.html'
        });
    });
});