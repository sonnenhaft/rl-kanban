angular.module('component.sanitize-filter', [])
    .filter('sanitize', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
    });