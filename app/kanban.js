angular.module('kanban').directive('kanban', function (isTouch, $window) {
    function setVal(childElement, value) {
        childElement.css('width', (value || 0) * 228 + 'px');
    }

    var $body = angular.element($window.document.body);

    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        controller: function ($scope) {
            var registeredElements = [];

            $scope.isTouch = isTouch;


            $body.bind('keyup', function onEscPressed (e) {
                if (e.which === 27) {
                    $scope.config.tasks.forEach(function (task) {
                        delete    task.$highlight;
                        $scope.$digest();
                    })
                }
            });

            $scope.$on('$destroy', function(){
                $body.unbind('keyup', onEscPressed);
            });

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

            this.getHighlighted = function (fn) {
                return $scope.config.tasks.filter(function (task) {
                    return task.$highlight;
                })
            };

            this.highlightTask = function (task) {
                $scope.config.tasks.forEach(function (task) {
                    delete task.$highlight;
                });
                task.$highlight = true;
                $scope.$evalAsync();
            };

            this.validateStates = function () {
                this.getHighlighted().forEach(function (task) {
                    $scope.config.swimlanes.forEach(function (swimlane) {
                        swimlane.columns.filter(function (column) {
                            return !column.$barred && task.validStates && task.validStates.indexOf(column.id) === -1;
                        }).forEach(function (column) {
                            column.$barred = true;
                        });
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
