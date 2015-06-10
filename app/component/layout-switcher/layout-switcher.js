angular.module('component.layout-switcher', []).directive('layoutSwitcher', function ($location, $window) {
    return {
        restrict: 'E',
        templateUrl: 'app/component/layout-switcher/layout-switcher.html',
        scope: {},
        link: function ($scope) {
            $scope.contentLevel = 'low';
            $scope.template = 'planner';

            $scope.$watch('contentLevel', function(contentLevel){
                $location.search('contentLevel', contentLevel);
            });

            $scope.$watch('template', function(template){
                $location.search('template', template);
            });
        }
    };
});