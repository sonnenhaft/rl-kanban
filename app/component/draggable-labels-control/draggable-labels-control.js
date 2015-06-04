angular.module('component.draggable-labels-control', []).directive('draggableLabelsControl', function () {
    return {
        scope: {groups: '='},
        replace: true,
        templateUrl: 'app/component/draggable-labels-control/draggable-labels-control.html',
        controller: function ($scope, $element, $attrs) {
            $scope.$watch('groups.length', function (length) {
                var height = length ? length * $attrs.labelHeight + 4 : 0;
                $element.css('height', height + 'px');
            });

            this.updateIndex = function (formIndex, toIndex) {
                if (toIndex === formIndex || toIndex < 0 || toIndex > $scope.groups.length - 1) {
                    return;
                }

                var from = $scope.groups.filter(function (item) {
                    return item.index === formIndex;
                })[0];

                var to = $scope.groups.filter(function (item) {
                    return item.index === toIndex;
                })[0];
                from.index = toIndex;
                to.index = formIndex;

                $scope.$digest();
            };
        }
    };
});