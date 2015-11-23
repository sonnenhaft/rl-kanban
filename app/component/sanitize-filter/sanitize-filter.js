angular.module('component.sanitize-filter', [
    'ngSanitize'
]).filter('sanitize', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
});