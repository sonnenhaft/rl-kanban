angular.module('kanban').directive('kanban', function () {
    function setVal(childElement, value) {
        childElement.css('width', (value || 0) * 228 + 'px');
    }
    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        controller: function ($scope) {
            var registeredElements = [];

            $scope.isIOS = /iPad|iPhone|iPod/.test( navigator.userAgent );

            $scope.$watch('config.columns.length', function(value){
                registeredElements.forEach(function(childElement){
                    setVal(childElement, value);
                });
            });

            this.registerElement = function (childElement) {
                registeredElements.push(childElement);
                var value;
                if ($scope.config && $scope.config.columns) {
                    value = $scope.config.columns;
                }
                setVal(childElement, value);
            };

            this.removeElement = function (childElement) {
                registeredElements.splice(registeredElements.indexOf(childElement), 1);
            };
        }
    };
});