angular.module('component.layout-switcher').directive('layoutSwitcher', function ($location) {
    return {
        templateUrl: 'app/component/layout-switcher/layout-switcher.html',
        scope: true,
        link: function ($scope) {
            $scope.hash = $location.search();
            $scope.hash.layout = $scope.hash.layout || 'workTracker';
            $scope.hash.contentLevel = $scope.hash.contentLevel || 'maximum';
            ['layout', 'contentLevel', 'readOnly', 'empty'].forEach(function (key) {
                $scope.$watch('hash.' + key, function (value) {
                    $location.search(key, value);
                });
            });
        }
    };
}).controller('layoutSwitcherController', function ($location, $scope, layoutSwitcherConfigs, contentLevelConfigs, $modal) {
    $scope.locationSearch = $location.search();

    $scope.$watchCollection('locationSearch', function (locationSearch) {
        $scope.config = angular.copy(layoutSwitcherConfigs[locationSearch.layout || 'planner']);
        if (locationSearch.contentLevel) {
            var config = contentLevelConfigs[(locationSearch.layout === 'workTracker' ? locationSearch.layout : 'planner')];
            $scope.config.settings.tasksDisplayFields = config[locationSearch.contentLevel];
        }

        if (locationSearch.empty) {
            $scope.config.groups = [];
            $scope.config.tasks = [];
        }

        if ($scope.config.settings) {
            $scope.config.settings.readOnly = locationSearch.readOnly;
        }

        $scope.$on('kanban:task:moved', function ($event, taskId) {
            var columnId = '555b6911ba6d349f6253cd85';
            $scope.kanbanModel.tasks.forEach(function (task) {
                if (task.id === taskId && task.validStates) {
                    task.validStates.push(columnId);
                }
            });
        });

        $scope.$on('kanban:task:modalopen', function () {
            var modal = $modal.open({
                windowClass: 'tiny task-card-modal-demo',
                templateUrl: 'app/component/layout-switcher/demo-modal.html'
            });

            modal.result.finally(function(){modal = null;});
        });
    });
}).constant('layoutSwitcherConfigs', {}).constant('contentLevelConfigs', {});
