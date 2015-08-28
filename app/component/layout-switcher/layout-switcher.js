angular.module('component.layout-switcher').directive('layoutSwitcher', function ($location) {
    return {
        templateUrl: 'app/component/layout-switcher/layout-switcher.html',
        scope: true,
        link: function ($scope) {
            $scope.hash = $location.search();
            $scope.hash.layout = $scope.hash.layout  || 'planner';
                ['layout', 'contentLevel', 'readOnly', 'empty'].forEach(function(key){
                $scope.$watch('hash.' + key, function (value) {
                    $location.search(key, value);
                });    
            });
        }
    };
}).controller('layoutSwitcherController', function ($location, $scope, layoutSwitcherConfigs, contentLevelConfigs) {
    $scope.locationSearch = $location.search();

    $scope.$watchCollection('locationSearch', function (locationSearch) {
        if (!locationSearch.layout) {
            return;
        }

        $scope.config = angular.copy(layoutSwitcherConfigs[locationSearch.layout]);
        if (locationSearch.contentLevel) {
            var config = contentLevelConfigs[(locationSearch.layout === 'workTracker' ?  locationSearch.layout : 'planner')];
            $scope.config.settings.tasksDisplayFields = config[locationSearch.contentLevel];
        }

        if (locationSearch.empty) {
            $scope.config.groups = [];
            $scope.config.tasks = [];
        }

        if ($scope.config.settings) {
            $scope.config.settings.readOnly = locationSearch.readOnly;
        }
    });
}).constant('layoutSwitcherConfigs', {
}).constant('contentLevelConfigs', {
});
