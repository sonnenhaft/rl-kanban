angular.module('component.layout-switcher', []).directive('layoutSwitcher', function ($rootScope, $location, plannerStub, workTrackerStub) {
    return {
        restrict: 'E',
        templateUrl: 'app/component/layout-switcher/layout-switcher.html',
        scope: {},
        link: function ($scope, $rootScope) {
            $scope.contentLevel = $location.search().contentLevel || 'low';
            $scope.template = $location.search().template || 'planner';

            var stubs = {
                'planner': plannerStub,
                'wt': workTrackerStub
            };

            $scope.$watch('template', function(template){
                $rootScope.config = stubs[template];
                $location.search('template', template);
            });

            $scope.$watch('contentLevel', function(contentLevel){
                $rootScope.config.settings.contentLevel = contentLevel;
                $location.search('contentLevel', contentLevel);
            });
        }
    };
}).run(function(workTrackerStub, $location, plannerStub, $rootScope){
    var stubs = {
        'planner': plannerStub,
        'wt': workTrackerStub
    };

    $rootScope.config = stubs[$location.search().template];
});
