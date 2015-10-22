angular.module('kanban').directive('kanban', function (isTouch) {
    function setVal(childElement, value) {
        childElement.css('width', (value || 0) * 228 + 'px');
    }

    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        controller: function ($scope) {
            var registeredElements = [];

            $scope.isTouch = isTouch;

            $scope.$watch('config.columns.length', function (value) {
                registeredElements.forEach(function (childElement) {
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

            this.highlightTask = function (task) {
                $scope.config.tasks.forEach(function (task) {
                    delete task.$highlight;
                });
                task.$highlight = true;
                $scope.$evalAsync();
            };

            this.validateStates = function (task) {
                $scope.config.swimlanes.forEach(function (swimlane) {
                    swimlane.columns.forEach(function (column) {
                        if (task.validStates.indexOf(column.id) === -1) {
                            column.$barred = true;
                        }
                    });
                });
            };

            this.clearInvalidStates = function () {
                $scope.config.swimlanes.forEach(function (swimlane) {
                    swimlane.columns.forEach(function (column) {
                        if (column.$barred) {
                            delete column.$barred;
                        }
                    });
                });
            };
        }
    };
});
