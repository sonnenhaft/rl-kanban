angular.module('component.draggable-labels-control', [
]).directive('draggableLabelsControl', function () {
    return {
        scope: {groups: '='},
        replace:true,
        templateUrl: 'app/component/draggable-labels-control/draggable-labels-control.html',
        controller: function ($scope, $element, $attrs) {
            var labelHeight = $attrs.labelHeight - 0;
            $scope.$watch('groups.length', function(length){
                length = length || 0;
                $element.css('height', ((length + 1) * labelHeight - 4) + 'px');
            });

            this.updateIndex = function (formIndex, toIndex) {
                if (toIndex === formIndex || toIndex < 0 || toIndex > $scope.groups.length - 1) {
                    return
                }

                var from = $scope.groups.filter(function (item) {
                    return item.index == formIndex;
                })[0];

                var to = $scope.groups.filter(function (item) {
                    return item.index == toIndex;
                })[0];
                from.index = toIndex;
                to.index = formIndex;

                $scope.$digest();
            };

            this.remove = function (group) {
                var groups = $scope.groups;
                groups.splice(groups.indexOf(group), 1);
                $scope.groups = groups.sort(function (group1, group2) {
                    return group1.index > group2.index ? 1 : -1;
                });

                groups.forEach(function (group, index) {
                    return group.index = index;
                });
            };

        }
    };
});