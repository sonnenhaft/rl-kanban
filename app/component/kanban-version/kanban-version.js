angular.module('component.kanban-version', [
]).directive('kanbanVersionTag', function ($http, $log, kanbanVersionValue, $q) {
    var kanbanVersionPromise = kanbanVersionValue ? $q.when({data: {version: kanbanVersionValue}}) : $http.get('package.json');
    return {
        link: function ($scope) {
            kanbanVersionPromise.then(function (data) {
                $scope.version = data.data.version;
            });
        },
        templateUrl: 'app/component/kanban-version/kanban-version.html'
    };
}).provider('kanbanVersionValue', function () {
    var version;
    this.set = function (_version) {version = _version;};
    this.$get = function () {return version;};
});