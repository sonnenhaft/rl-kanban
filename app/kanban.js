angular.module('kanban').directive('kanban', function ($window, isTouch, globalOnClickOnEsc) {
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

            $scope.$on('$destroy', globalOnClickOnEsc(function unhiglightAll() {
                if (!$scope.config) {
                    return;
                }
                $scope.config.tasks.forEach(function (task) {
                    delete  task.$highlight;
                });
                $scope.$digest();
            }));

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
                        validateColumns(task);
                    });
                } else {
                    validateColumns(task);
                }
            };

            function validateColumns(task) {
                if (task.validStates && task.validStates.length) {
                    $scope.config.swimlanes.forEach(function (swimlane) {
                        swimlane.columns.filter(function (column) {
                            return !column.$barred && task.column !== column;
                        }).filter(function (column) {
                            return task.validStates.indexOf(column.id) === -1;
                        }).forEach(function (column) {
                            column.$barred = true;
                        });
                    });
                }
            }

            this.validateColumns = validateColumns;

            this.clearInvalidStates = function () {
                $scope.config.swimlanes.forEach(function (swimlane) {
                    swimlane.columns.filter(function (column) {
                        return column.$barred;
                    }).forEach(function (column) {
                        column.$barred = false;
                    });
                });
            };

            this.checkEditableSwimlanes = function () {
                $scope.config.swimlanes.filter(function (swimlane) {
                    return swimlane.$edit;
                }).forEach(function (swimlane) {
                    swimlane.cancelEdit();
                });
            };

            this.toggleColumn = function (columnId) {
                $scope.config.swimlanes.forEach(function (swimlane) {
                    swimlane.columns.filter(function (column) {
                        return column.id === columnId;
                    }).forEach(function (column) {
                        column.$collapsed ? column.expand() : column.collapse();
                    });
                });
            };
        }
    };
}).config(function ($httpProvider) {
    $httpProvider.useApplyAsync(true);
});
