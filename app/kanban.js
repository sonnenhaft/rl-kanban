angular.module('kanban').directive('kanban', function ($window, $document, isTouch, globalOnEsc) {
    return {
        scope: {config: '='},
        replace: true,
        templateUrl: 'app/kanban.html',
        controller: function ($scope) {
            var registeredElements = [];
            var $body = $document.find('body').eq(0);

            $scope.isTouch = isTouch;

            $scope.$on('$destroy', globalOnEsc(function unhiglightAll() {
                if (!$scope.config || $body.hasClass('modal-open')) {return;}
                $scope.config.tasks.forEach(function (task) {
                    delete task.$highlight;
                });
                $scope.$digest();
            }));

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

            function validateColumns(task) {
                if (!task.validStates || !task.validStates.length) {
                    return;
                }
                $scope.config.swimlanes.forEach(function (swimlane) {
                    swimlane.columns.filter(function (column) {
                        return !column.$barred;
                    }).filter(function (column) {
                        return task.validStates.indexOf(column.id) === -1;
                    }).forEach(function (column) {
                        column.$barred = true;
                    });
                });
            }

            var registeredElements = [];
            this.registerElement = function (childElement, childScope) {
                registeredElements.push(childElement);
                if ($scope.config && $scope.config.columns) {
                    childElement.css('width', $scope.config.columns.length * 228 + 'px');
                }
                childScope.$on('destroy', function(){
                    registeredElements.splice(registeredElements.indexOf(childElement), 1);
                });
            };

            this.validateColumns = validateColumns;

            this.validateStates = function (task) {
                if ($scope.config.settings.highlightTaskOnClick) {
                    this.getHighlighted().forEach(function (task) {
                        validateColumns(task);
                    });
                } else {
                    this.validateColumns(task);
                }
            };

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
