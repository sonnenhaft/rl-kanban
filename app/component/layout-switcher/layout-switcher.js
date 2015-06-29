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
    $scope.$watch('locationSearch.template', function (template) {
        if (template === 'wt') {
            $scope.config = workTrackerStub;
        } else {
            $scope.config = plannerStub;
        }
    });

    $scope.$watch('locationSearch.contentLevel', function(contentLevel){
        if (contentLevel) {
            $scope.config = angular.copy($scope.config);
            $scope.config.settings.contentLevel = contentLevel;
        }
    });
});