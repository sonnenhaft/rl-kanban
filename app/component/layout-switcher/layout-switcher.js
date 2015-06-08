angular.module('component.layout-switcher', []).directive('layoutSwitcher', function ($location, $window) {
    return {
        restrict: 'E',
        templateUrl: 'app/component/layout-switcher/layout-switcher.html',
        scope: {},
        link: function (scope, element, attrs) {
            scope.switchTmpl = function(tmpl) {
                $location.search('tmpl', tmpl);
                $window.location.reload();
            };

            scope.switchCl = function(cl) {
                $location.search('cl', cl);
                $window.location.reload();
            };
        }
    };
});