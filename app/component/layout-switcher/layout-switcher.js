angular.module('component.layout-switcher', []).directive('layoutSwitcher', function ($location) {
    return {
        templateUrl: 'app/component/layout-switcher/layout-switcher.html',
        scope: true,
        link: function ($scope) {
            $scope.$watch('template', function(template){
                $location.search('template', template);
            });

            $scope.$watch('contentLevel', function(contentLevel){
                $location.search('contentLevel', contentLevel);
            });
        }
    };
}).controller('layoutSwitcherController', function($location, $scope, plannerStub, workTrackerStub){
    $scope.locationSearch = $location.search();
    $scope.$watchCollection('locationSearch', function (locationSearch) {
        if (locationSearch.template === 'wt') {
            $scope.config = workTrackerStub;
        } else {
            $scope.config = plannerStub;
        }
        if (locationSearch.contentLevel) {
            $scope.config.settings.contentLevel = locationSearch.contentLevel;
            $scope.config = angular.copy($scope.config);
        }
    });
});