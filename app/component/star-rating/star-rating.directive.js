angular.module('component.star-rating', [
]).directive('starRating', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/component/star-rating/star-rating.html',
        scope: {
            value: '=',
            max: '=?' //optional: default is 5
        },
        link: function (scope) {
            if (scope.max === undefined) {
                scope.max = 5;
            }
            scope.stars = [];
            for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    filled: i < scope.value
                });
            }
        }
    };
});