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

            function onEscPressed(e) {
                if (e.which === 27) {
                    $scope.config.tasks.forEach(function (task) {
                        delete    task.$highlight;
                        $scope.$digest();
                    });
                }
            }

            $body.bind('keyup', onEscPressed);

            $scope.$on('$destroy', function () {
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

            this.getHighlighted = function () {
                var m = $scope.config.settings.enableMultiSelect;
                return $scope.config.tasks.filter(function (task) {
                    return m ? task.$highlight : task.$lastHighlight;
                });
            };

            this.highlightTask = function (task) {
                $scope.config.tasks.forEach(function (task) {
                    task.$highlight = false;
                    task.$lastHighlight = false;
                });
                task.$highlight = true;
                task.$lastHighlight = true;
                $scope.$evalAsync();
            };

            this.validateStates = function (task) {
                if ($scope.config.settings.highlightTaskOnClick) {
                    this.getHighlighted().forEach(function (task) {
                        this.validateColumns(task);
                    }.bind(this));
                } else {
                    this.validateColumns(task);
                }
            };

            this.validateColumns = function(task) {
                $scope.config.swimlanes.forEach(function (swimlane) {
                    swimlane.columns.filter(function (column) {
                        return !column.$barred && task.validStates && task.validStates.indexOf(column.id) === -1;
                    }).forEach(function (column) {
                        column.$barred = true;
                    });
                });
            };

            this.clearInvalidStates = function () {
                $scope.config.swimlanes.forEach(function (swimlane) {
                    swimlane.columns.forEach(function (column) {
                        if (column.$barred) {
                            column.$barred = false;
                        }
                    });
                });
            };

            this.checkEditableSwimlanes = function () {
                $scope.config.swimlanes.forEach(function (swimlane) {
                    if (swimlane.$edit) {
                        swimlane.cancelEdit();
                    }
                });
            };
        }
    };
});
