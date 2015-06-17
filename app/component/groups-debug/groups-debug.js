angular.module('component.groups-debug', []).directive('groupsDebug', function () {
    return {
        templateUrl: 'app/component/groups-debug/groups-debug.html',
        scope: {groups: '='}
    };
}).directive('opacityOnChanged', function ($timeout) {
    return function ($scope, $element, $attr) {
        var val;
        $scope.$watch($attr.opacityOnChanged, function (value) {
            val = value;
            $element.addClass('opacity-on-changed');
            $timeout(function () {
                if (val === value) {
                    $element.text(value);
                }
            }, 1000, false);

            $timeout(function () {
                if (val === value) {
                    $element.removeClass('opacity-on-changed');
                }
            }, 2000, false);
        });
    };
});