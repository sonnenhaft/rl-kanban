angular.module('kanban').directive('kanban', function (KanbanGroup) {
    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        controller: function ($scope) {
            var registeredElements = [];
            this.registerElement = function (childElement) {
                registeredElements.push(childElement);
                childElement.css('width', $scope.config.columns.length * 228 + 'px');
            };

            this.removeElement = function (childElement) {
                registeredElements.splice(registeredElements.indexOf(childElement), 1);
            };

            $scope.$watch('config.columns.length', function (length) {
                registeredElements.forEach(function (element) {
                    element.css('width', length * 228 + 'px');
                });
            });
        }
    };
}).controller('kanbanDataController', function ($scope, hostedStub) {
    $scope.hostedStub = hostedStub;
});