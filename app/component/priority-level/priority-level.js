angular.module('component.priority-level', []).directive('priorityLevel', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/component/priority-level/priority-level.html',
        scope: {
            value: '='
        },
        link: function (scope, element, attrs) {}
    };
});