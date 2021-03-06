angular.module('demo-code.groups-debug').directive('opacityOnChanged', function ($timeout) {
    return function ($scope, $element, $attr) {
        $scope.$watch($attr.opacityOnChanged, function (value) {
            if (!value) {
                return;
            }

            $element.addClass('opacity-on-changed');
            $timeout(function () { $element.removeClass('opacity-on-changed');}, 1000, false);

            if ($attr.setText) {
                $timeout(function () { $element.text(value); }, 500, false);
            } else {
                $scope.$eval($attr.evalAfter);
            }
        });
    };
});