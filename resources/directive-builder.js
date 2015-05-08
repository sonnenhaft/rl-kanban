angular.module('ngMock').factory('directiveBuilder', function ($rootScope, $compile) {
    return {
        build: function (htmlToCompile, scopeParams) {
            var scope = angular.extend($rootScope.$new(), scopeParams || {});
            var element = angular.element(htmlToCompile);
            $compile(element)(scope);
            return {scope: scope, element: element}
        }
    }
});