angular.module('kanban.templates', []);
angular.module('kanban', [
    'component.kanban-model',
    'ngAnimate',
    'ngTouch',
    'component.scrollable-element',
    'kanban.templates',
    'component.kanban-board',
    'component.task-groups.task-groups-button',
    'component.add-new-control',
    //TODO: remove unused dependencies
    'as.sortable',
    'mm.foundation',
    'component.task-groups.task-group',
    'component.task-groups.task-group-list',
    'component.column-names',
    'component.kanban-header',
    'component.swim-lane',
    'component.scroll-bar',
    'component.star-rating',
    'component.priority-level',
    'component.expand-collapse',
    'component.stickyHeader',
    'component.add-dropdown',
    'component.sanitize-filter',
    'kanban-constant'
]).run(["$log", "kanbanVersion", function($log, kanbanVersion){
    if (kanbanVersion) {
        $log.info('rl-kanban version: v' + kanbanVersion);
    }
}]);

angular.module('kanban-constant', []).constant('kanbanVersion', false);
angular.module('component.kanban-model', []);
angular.module('component.scroll-bar', []);
angular.module('component.task-groups.task-group', [
    'component.glyph-icon',
    'component.task-groups.task-group-list',
    'component.modal.task-group-modal'
]);
angular.module('kanban').directive('kanban', ["$window", "$document", "isTouch", "globalOnEsc", function ( $window, $document, isTouch, globalOnEsc ) {
    return {
        scope: { config: '=' },
        replace: true,
        templateUrl: 'app/kanban.html',
        controller: ["$scope", function ( $scope ) {
            var registeredElements = [];
            var $body = $document.find('body').eq(0);

            $scope.isTouch = isTouch;

            $scope.$on('$destroy', globalOnEsc(function unhiglightAll() {
                if ( !$scope.config || $body.hasClass('modal-open') ) {return;}
                $scope.config.tasks.forEach(function ( task ) {
                    delete task.$highlight;
                    if (task.group && task.group.$highlightedGroup) {
                        delete task.group.$highlightedGroup;
                    }
                });
                $scope.$digest();
            }));

            this.getHighlighted = function () {
                var m = $scope.config.settings.enableMultiSelect;
                return $scope.config.tasks.filter(function ( task ) {
                    return m ? task.$highlight : task.$lastHighlight;
                });
            };

            this.highlightTask = function ( task ) {
                $scope.config.tasks.forEach(function ( task ) {
                    task.$highlight = false;
                    task.$lastHighlight = false;
                });
                task.$highlight = true;
                task.$lastHighlight = true;
                $scope.$evalAsync();
            };

            function validateColumns( task ) {
                if ( !task.validStates || !task.validStates.length ) {
                    return;
                }
                $scope.config.swimlanes.forEach(function ( swimlane ) {
                    swimlane.columns.filter(function ( column ) {
                        return !column.$barred;
                    }).filter(function ( column ) {
                        return task.validStates.indexOf(column.id) === -1;
                    }).forEach(function ( column ) {
                        column.$barred = true;
                    });
                });
            }

            registeredElements = [];
            this.registerElement = function ( childElement, childScope ) {
                registeredElements.push(childElement);
                if ( $scope.config && $scope.config.columns ) {
                    childElement.css('width', $scope.config.columns.length * 228 + 'px');
                }
                childScope.$on('destroy', function () {
                    registeredElements.splice(registeredElements.indexOf(childElement), 1);
                });
            };

            $scope.$watch('config.columns', function ( columns ) {
                columns = columns || [];
                registeredElements.forEach(function ( childElement ) {
                    childElement.css('width', columns.length * 228 + 'px');
                });
            });

            this.validateColumns = validateColumns;

            this.validateStates = function ( task ) {
                if ( $scope.config.settings.highlightTaskOnClick ) {
                    this.getHighlighted().forEach(function ( task ) {
                        validateColumns(task);
                    });
                } else {
                    this.validateColumns(task);
                }
            };

            this.clearInvalidStates = function () {
                $scope.config.swimlanes.forEach(function ( swimlane ) {
                    swimlane.columns.filter(function ( column ) {
                        return column.$barred;
                    }).forEach(function ( column ) {
                        column.$barred = false;
                    });
                });
            };

            this.checkEditableSwimlanes = function () {
                $scope.config.swimlanes.filter(function ( swimlane ) {
                    return swimlane.$edit;
                }).forEach(function ( swimlane ) {
                    swimlane.cancelEdit();
                });
            };

            this.toggleColumn = function ( columnId ) {
                $scope.config.swimlanes.forEach(function ( swimlane ) {
                    swimlane.columns.filter(function ( column ) {
                        return column.id === columnId;
                    }).forEach(function ( column ) {
                        column.$collapsed ? column.expand() : column.collapse();
                    });
                });
            };
        }]
    };
}]).config(["$httpProvider", function ( $httpProvider ) {
    $httpProvider.useApplyAsync(true);
}]);

angular.module('component.add-dropdown',[
]).directive('addDropdown', function(){
    return {
        scope: {
            settings: '=',
            groups: '='
        },
        templateUrl: 'app/component/add-dropdown/add-dropdown.html'
    };
});
angular.module('component.add-new-control', [
]).directive('addNewControl', function(){
    return {
        templateUrl: 'app/component/add-new-control/add-new-control.html',
        scope: true,
        link: function($scope){
            $scope.addTask = function(){
                $scope.$emit('addTask');
            };

            $scope.addGroup = function(){
                $scope.$emit('addGroup');
            };
        }
    };
});
angular.module('component.column-names', [
    'mm.foundation.tooltip',
    'mm.foundation.position',
    'mm.foundation.bindHtml',
    'ie-9-fixes'
]).directive('columnNames', function () {
    return {
        scope: {columns: '=', settings: '='},
        require: '^kanban',
        templateUrl: 'app/component/column-names/column-names.html',
        link: function (scope, element, attrs, kanban) {
            scope.toggleColumn = function (column) {
                if (scope.settings.showHideColumns) {
                    column.$collapsed = !column.$collapsed;
                    scope.$emit(column.$collapsed ? 'kanban:column:hide' : 'kanban:column:show', column.id);
                    return kanban.toggleColumn(column.id);
                }
            };
        }
    };
});
angular.module('component.expand-collapse', [])
    .directive('expandCollapse', ["$animate", "$parse", function ($animate, $parse) {
        return {
            link: function (scope, element, attrs) {

                var isDisabled = $parse(attrs.expandDisabled)(scope);
                if (isDisabled) {return;}

                function toggleCollapse(value) {
                    if (value) {
                        element.removeClass('kanban-collapse').addClass('kanban-collapsing');
                        $animate.addClass(element, 'kanban-in', {
                            to: {height: element[0].scrollHeight + 'px'}
                        }).then(function () {
                            element.removeClass('kanban-collapsing');
                            element.css({height: 'auto'});
                        });
                    } else {
                        element
                            .css({height: element[0].scrollHeight + 'px'})
                            .removeClass('kanban-collapse')
                            .addClass('kanban-collapsing');

                        $animate.removeClass(element, 'kanban-in', {
                            to: {height: '0'}
                        }).then(function () {
                            element.css({height: '0'});
                            element.removeClass('kanban-collapsing');
                            element.addClass('kanban-collapse');
                        });
                    }
                }

                scope.$watch(attrs.expandCollapse, toggleCollapse);
            }
        };
    }]);
/**
 * @ngdoc directive
 * @name component.directive:glyph-icon
 * @restrict E
 * @param {string} icon of the class of one of the icons from Glyph Icons font.
 * @description
 * Displays icon from RlGlyph icons collection.
 */
angular.module('component.glyph-icon', [
]).directive('glyphIcon', function () {
    return {
        templateUrl: 'app/component/glyph-icon/glyph-icon.html',
        scope: {
            icon: '='
        }
    };
});

angular.module('component.kanban-board', [
    'component.kanban-column',
    'component.expand-collapse',
    'component.scrollable-element',
    'component.kanban-model',
    'ie-9-fixes'
]).directive('kanbanBoard', ["$window", "KanbanColumn", "fixIE9", function ($window, KanbanColumn, fixIE9) {
    return {
        templateUrl: 'app/component/kanban-board/kanban-board.html',
        require: ['^scrollableElement', '^kanban', '^horizontalScroll'],
        scope: {
            swimlane: '=',
            settings: '=',
            limit: '='
        },
        replace: true,
        link: function ($scope, $element, $attrs, $ctrl) {
            var scrollableElement = $ctrl[0];
            var kanban = $ctrl[1];
            var horizontalScroll = $ctrl[2];

            $scope.scrollableElement = scrollableElement;

            $scope.addResources = function () {
                $scope.$emit('kanban:add-task-assessment', $scope.swimlane.id);
            };

            if ($scope.swimlane.isTeam) {
                //just for capability with non team swimlanes
                $scope.column = new KanbanColumn({tasks: [], swimlane: $scope.swimlane});
            }

            var conditions;

            function rememberScrolls() {
                conditions = {
                    scrollTop: $element[0].scrollTop,
                    scrollLeft: horizontalScroll.$element[0].scrollLeft,
                    scrollX: $window.scrollX,
                    scrollY: $window.scrollY
                };
            }

            function rollbackScrolls() {
                if (!conditions) {return;}
                $element[0].scrollTop = conditions.scrollTop;
                horizontalScroll.$element[0].scrollLeft = conditions.scrollLeft;
                $window.scrollTo(conditions.scrollX, conditions.scrollY);
            }

            $scope.scrollCallbacks = {
                containment: $scope.settings.containment ? '#swimlane-' + $scope.swimlane.index + ' .kanban-board' : null,
                dragStart: function (e) {
                    rememberScrolls();
                    fixIE9('unselect-text');
                    var task = e.source.itemScope.task;
                    kanban.activeScrollableElement = scrollableElement;
                    kanban.activeScrollableElement.watchMouse();
                    $scope.$emit('kanban:task:start', task.id);
                    if (angular.isDefined(task.group)) {
                        task.group.$highlightedGroup = true;
                    }
                    if ($scope.settings.highlightTaskOnClick && !task.$highlight) {
                        kanban.highlightTask(task);
                    }
                    if (task.validStates) {
                        kanban.validateStates(task);
                    }
                    if ($scope.settings.editableSwimlanes) {
                        kanban.checkEditableSwimlanes();
                    }
                },
                orderChanged: function (e) {
                    var task = e.source.itemScope.task;
                    $scope.$emit('kanban:task:orderchanged', task.id);
                },
                dragEnd: function (e) {
                    var task = e.source.itemScope.task;
                    $scope.$emit('kanban:task:stop', task.id);
                    kanban.activeScrollableElement.stopWatching();
                    if (angular.isArray(task.validStates)) {
                        kanban.clearInvalidStates();
                    }
                },
                itemMoved: function (e) {
                    var newColumn = e.dest.sortableScope.column;
                    var sourceTask = e.source.itemScope.task;

                    if (newColumn.$barred && !newColumn.swimlane.isTeam) {
                        e.dest.sortableScope.removeItem(e.dest.index);
                        e.source.itemScope.sortableScope.insertItem(e.source.index, sourceTask);
                        rollbackScrolls();
                    } else {
                        if ($scope.settings.highlightTaskOnClick) {
                            kanban.getHighlighted().forEach(function (task) {
                                task.moveToColumn(newColumn);
                                if (task !== sourceTask) {
                                    var tasks = task.column.tasks;
                                    tasks.splice(tasks.indexOf(task), 1);
                                    tasks.splice(tasks.indexOf(sourceTask) + 1, 0, task);
                                }
                            });
                        } else {
                            sourceTask.moveToColumn(newColumn);
                        }
                        if (newColumn.swimlane.isTeam) {
                            newColumn.tasks = [];
                        }
                    }
                },
                accept: function (sourceSortableScope, destSortableScope) {
                    var parentScrollable = destSortableScope.scrollableElement;
                    if (parentScrollable && kanban.activeScrollableElement !== parentScrollable) {
                        kanban.activeScrollableElement.stopWatching();
                        kanban.activeScrollableElement = parentScrollable;
                        kanban.activeScrollableElement.watchMouse();
                    }
                    if (destSortableScope.column.swimlane.isTeam) {
                        return true;
                    } else if (destSortableScope.column.$collapsed) {
                        return false;
                    } else if ($scope.settings.acceptTasks) {
                        return true;
                    } else {
                        return sourceSortableScope.column.swimlane.id === destSortableScope.column.swimlane.id;
                    }
                }
            };

        }
    };
}]);
angular.module('component.kanban-card', [
    'component.glyph-icon',
    'component.modals.task-card-modal',
    'component.modals.confirmation-modal',
    'component.is-touch',
    'component.tool-tip',
    'component.sanitize-filter',
    'ie-9-fixes'
]).directive('kanbanCard', ["$timeout", "$rootScope", "$parse", "openTaskCard", "openConfirmationModal", "kanbanCardFields", "isTouch", "fixIE9", function ($timeout, $rootScope, $parse,
                                                                          openTaskCard, openConfirmationModal, kanbanCardFields, isTouch, fixIE9) {
    return {
        templateUrl: 'app/component/kanban-card/kanban-card.html',
        require: '^kanban',
        link: function ($scope, $element, $attrs, kanban) {
            $scope.fields = angular.extend(angular.copy(kanbanCardFields), $scope.settings.tasksDisplayFields);

            $scope.clickCallbacks = function (task, $event, force) {
                $event.stopPropagation();

                if ($scope.settings.enableMultiSelect && ($event.ctrlKey || $event.metaKey)) {
                    return;
                }

                if ($scope.settings.legacyCardModal && !force) {
                    $scope.$emit('kanban:task:modalopen', task);
                } else if (!task.$edit) {
                    openTaskCard(task, $scope.settings);
                }
            };

            $scope.highlightTask = function(task, $event){
                fixIE9('unselect-text');
                if (!task.$edit && $scope.settings.highlightTaskOnClick) {
                    if (!$scope.settings.enableMultiSelect) {
                        kanban.highlightTask(task);
                    } else if ($event.ctrlKey || $event.metaKey) {
                        task.$highlight = !task.$highlight;
                    } else if (!task.$highlight) {
                        kanban.highlightTask(task);
                    }
                }
            };

            $scope.limit = 50;

            $scope.showFullDescription = function (task, settings, $event) {
                if (task.$edit) { return; }
                $event.stopPropagation();
                $scope.limit = task.notes.length;
                if (settings.highlightTaskOnClick) {
                    kanban.highlightTask(task);
                }
            };

            $scope.deleteTask = function ($event, task) {
                $event.stopPropagation();
                openConfirmationModal($scope).then(function () {
                    task.remove();
                    $rootScope.$broadcast('kanban:task:remove', task.id);
                });
            };

            $scope.groupColor = $parse('group.color')($scope.task) || null;

            var wrapper = $element.children();
            var borderColor = $scope.groupColor || '#326295';
            $scope.$watch('task.$highlight', function (value) {
                if (value) {
                    wrapper.addClass('card-highlight');
                    wrapper.css('borderColor', borderColor);
                } else {
                    wrapper.removeClass('card-highlight');
                    wrapper.css('borderColor', 'transparent');
                }
            });

            if (isTouch) {
                var swimlane = $scope.task.column.swimlane;

                if (!swimlane.$disabled) {
                    swimlane.$disabled = true;
                }

                var timeout = null;
                $element.on('touchstart', function () {
                    timeout = $timeout(function () {
                        swimlane.$disabled = false;
                    }, 500);
                }).on('touchend', function () {
                    swimlane.$disabled = true;
                    $timeout.cancel(timeout);
                });

                var cardHandle = angular.element($element[0].getElementsByClassName('card-handle'));
                cardHandle.on('touchstart', function () {
                    swimlane.$disabled = false;
                    $scope.$apply();
                }).on('touchend', function () {
                    swimlane.$disabled = true;
                    $scope.$apply();
                });

                $scope.$on('$destroy', function () {
                    cardHandle.off();
                });
            }
        }
    };
}]).directive('ngLazyClick', ["$parse", function ($parse) {
    return {
        compile: function ($element, $attr) {
            var fn = $parse($attr.ngLazyClick);
            return function ($scope, $element) {
                $element.on('click', function ($event) {
                    $scope.$apply(function () {
                        fn($scope, {$event: $event});
                    });
                });
            };
        }
    };
}]);

angular.module('component.kanban-column', [
    'component.kanban-card'
]).directive('kanbanColumn', ["$q", "$timeout", "$parse", function ($q, $timeout, $parse) {
    return {
        templateUrl: 'app/component/kanban-column/kanban-column.html',
        restrict: 'A',
        scope: true,
        link: function ($scope) {
            $scope.limit = 0;
            $scope.swimlane.$tasksCount += $parse('column.tasks.length')($scope);

            $scope.render = function () {
                var batchSize = 1;
                var computeAndLetUiRender = $q.when();
                $scope.swimlane.$loading += 1;

                function computeAndRenderBatch() {
                    $scope.limit += batchSize;
                    return $timeout(angular.noop, 0, false);
                }

                $scope.column.tasks.forEach(function () {
                    computeAndLetUiRender = computeAndLetUiRender.then(computeAndRenderBatch);
                });

                return computeAndLetUiRender;
            };

            var unregister = $scope.$watch('swimlane.collapsed', function (value) {
                if (angular.isDefined(value) && !value) {
                    $scope.render().then(function () {
                        $scope.swimlane.$loading -= 1;
                        $scope.limit = Infinity;
                    });
                    unregister();
                }
            });
        }
    };
}]);
angular.module('component.kanban-header', [

]).directive('kanbanHeader', function () {
    return {
        templateUrl: 'app/component/kanban-header/kanban-header.html',
        scope: {
            columns: '=',
            groups: '=',
            settings: '='
        }
    };
});
angular.module('component.priority-level', []).directive('priorityLevel', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/component/priority-level/priority-level.html',
        scope: {
            value: '='
        }
    };
});
angular.module('component.scroll-bar').directive('combineHorizontalScrolls', function () {
    return {
        restrict: 'A',
        controller: function () {
            var targetNodes = [];
            this.scrollBarElement = null;
            var synchronizeHorizonalScroll = angular.bind(this, function (scrollEvent) {
                var scrollLeft = scrollEvent.target.scrollLeft;
                var max = this.scrollBarElement.scrollWidth - this.scrollBarElement.clientWidth;

                targetNodes.forEach(function (targetNode) {
                    if (targetNode.scrollLeft !== scrollLeft &&  targetNode !== scrollEvent.target) {
                        targetNode.scrollLeft = scrollLeft > max ? max : scrollLeft;
                    } else if (targetNode.scrollLeft > max && targetNode === scrollEvent.target) {
                        targetNode.scrollLeft = max;
                    }
                });
            });

            this.registerScrollElement = function ($element) {
                targetNodes.push($element[0]);
                $element.on('scroll', synchronizeHorizonalScroll);
            };

            this.removeScrollElement = function ($element) {
                targetNodes.splice(targetNodes.indexOf($element[0]), 1);
                $element.off('scroll', synchronizeHorizonalScroll);
            };
        }
    };
});
angular.module('component.scroll-bar').directive('horizontalScroll', function () {
    return {
        restrict: 'A',
        require: '^combineHorizontalScrolls',
        controller: ["$element", function ($element) {
            this.$element = $element;
        }],
        link: function ($scope, $element, ignored, combineHorizontalScrolls) {
            combineHorizontalScrolls.registerScrollElement($element);

            $scope.$on('$destroy', function () {
                combineHorizontalScrolls.removeScrollElement($element);
            });
        }
    };
});
angular.module('component.scroll-bar').directive('scrollbar', function () {
    return {
        templateUrl: 'app/component/scroll-bar/scroll-bar.html',
        scope: {
            columns: '='
        },
        require: '^combineHorizontalScrolls',
        link: function ( $scope, $element, $attrs, combineHorizontalScrolls ) {
            combineHorizontalScrolls.scrollBarElement = $element[ 0 ];

            $scope.$on('$destroy', function () {
                combineHorizontalScrolls.scrollBarElement = null;
            });
        }
    };
}).directive('columnsWidth', function () {
    return {
        restrict: 'A',
        require: '^kanban',
        link: function ( $scope, $element, ignored, kanban ) {
            kanban.registerElement($element, $scope);
        }
    };
});

angular.module('component.scrollable-element', [
]).directive('scrollableElement', ["$window", "ScrollableElementFactory", function ($window, ScrollableElementFactory) {
    var SCROLL_STEP = 75;
    var SENSITIVITY_AREA = 50;
    var srollDelta;

    function getCoordinatePartToScroll(coord, dimensionProp) {
        var delta = coord - dimensionProp;
        if (delta + SENSITIVITY_AREA > 0) {
            srollDelta = parseInt(SCROLL_STEP / Math.abs(delta)) || SCROLL_STEP;
            return delta <= 0 ? Math.ceil(srollDelta / 10) * 10 : SCROLL_STEP;
        } else if (coord < SENSITIVITY_AREA) {
            srollDelta = parseInt(SCROLL_STEP / Math.abs(coord)) || SCROLL_STEP;
            return coord >= 0 ? -Math.ceil(srollDelta / 10) * 10 : -SCROLL_STEP;
        } else {
            return 0;
        }
    }

    var windowElement = angular.element($window);

    return {
        controller: ["$element", function ($element) {
            var fn = angular.noop;
            var e = $element[0];
            this.element = e;

            function runFn(x, y) {
                x = e.scrollLeft && e.scrollLeft < e.scrollWidth - e.clientWidth - 1 ? x : 0;
                y = e.scrollTop && e.scrollTop < e.scrollHeight - e.clientHeight - 1 ? y : 0;
                if (x || y) {
                    fn(x, y);
                }
            }

            var elementScroll = new ScrollableElementFactory(function (x, y) {
                e.scrollTop += y;
                e.scrollLeft += x;
                runFn(x, y);
            });

            elementScroll.calculateDot = function (mouseMoveEvent) {
                this.y = getCoordinatePartToScroll($window.pageYOffset + mouseMoveEvent.clientY - e.offsetTop, e.offsetHeight);
                this.x = getCoordinatePartToScroll($window.pageXOffset + mouseMoveEvent.clientX - e.offsetLeft, e.offsetWidth);
            };

            var lastEvent;
            var windowScroll = new ScrollableElementFactory(function (x, y) {
                $window.scrollTo($window.pageXOffset + x, $window.pageYOffset + y);
                elementScroll.scrollIfNecessary(lastEvent);
            });

            windowScroll.calculateDot = function (mouseMoveEvent) {
                this.y = getCoordinatePartToScroll(mouseMoveEvent.clientY, $window.innerHeight);
                this.x = getCoordinatePartToScroll(mouseMoveEvent.clientX, $window.innerWidth);
            };

            function scrollOnBorder(e) {
                lastEvent = e;
                elementScroll.scrollIfNecessary(e);
                windowScroll.scrollIfNecessary(e);
            }

            function touchOnBorder(e) {
                var firstTouch = e.touches[0];
                scrollOnBorder({
                    x: firstTouch.pageX - $window.pageXOffset,
                    y: firstTouch.pageY - $window.scrollY,
                    clientX: firstTouch.clientX,
                    clientY: firstTouch.clientY
                });
            }

            this.watchMouse = function (_fn) {
                fn = _fn || fn;
                windowElement.on('mousemove', scrollOnBorder);
                windowElement.on('touchmove', touchOnBorder);
            };

            this.stopWatching = function () {
                windowElement.off('mousemove', scrollOnBorder);
                windowElement.off('touchmove', touchOnBorder);
                elementScroll.stopInterval();
                windowScroll.stopInterval();
            };
        }]
    };
}]);

angular.module('component.star-rating', [
]).directive('starRating', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/component/star-rating/star-rating.html',
        scope: {
            value: '=',
            max: '=?' //optional: default is 5
        },
        link: function (scope) {
            if (scope.max === undefined) {
                scope.max = 5;
            }
            scope.stars = [];
            for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    filled: i < scope.value
                });
            }
        }
    };
});
angular.module('component.stickyHeader', [
]).directive('stickyHeader', ["$window", function ($window) {

    function getPosition() {
        return $window.document.body.scrollTop || $window.document.documentElement.scrollTop;
    }

    return {
        link: function ($scope, $element) {
            var iElement = $element[0];
            var isStuck = false;
            var start = iElement.getBoundingClientRect().top + getPosition();
            var style = $window.getComputedStyle(iElement);
            var wrapper = $element.wrap('<div></div>').parent();
            var $root = angular.element($window);

            function recheckPositions() {
                if (!isStuck) {
                    start = iElement.getBoundingClientRect().top + getPosition();
                }
            }

            function scrollSpy() {
                var pos = getPosition();
                recheckPositions();
                if (!isStuck && pos > start) {
                    wrapper.css({height: iElement.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom) + 'px'});
                    $element.css({width: iElement.offsetWidth + 'px', position: 'fixed', top: 0});
                    isStuck = true;
                } else if (isStuck && pos <= start) {
                    wrapper.css({height: ''});
                    $element.css({width: '', position: '', top: ''});
                    isStuck = false;
                }
            }

            $root.on('scroll', scrollSpy);
            $root.on('resize', recheckPositions);

            $scope.$on('$destroy', function () {
                $root.off('resize', recheckPositions);
                $root.off('scroll', scrollSpy);
                wrapper.remove();
            });
        }
    };
}]);
angular.module('component.swim-lane', [
]).directive('swimLane', function () {
    return {
        templateUrl: 'app/component/swim-lane/swim-lane.html',
        scope: {
            swimlane: '=',
            settings: '=',
            groups: '='
        },
        link: function ($scope, $element) {
            $scope.swimlane.collapsed = angular.isDefined($scope.swimlane.collapsed) ? $scope.swimlane.collapsed : false;
            $scope.swimlane.$tasksCount = 0;
            $scope.swimlane.$loading = 0;

            $element.bind('click', function (e) {
                var parent = e.target.parentNode;
                var el = $element[0];
                if (parent === el || parent.parentNode === el) {
                    e.stopPropagation();
                }
            });

            $scope.toggleCollapse = function () {
                $scope.swimlane.collapsed = !$scope.swimlane.collapsed;
            };

            $scope.addResource = function ($event) {
                if ($scope.groups.length) {
                    $scope.$emit('kanban:add-task', $scope.swimlane.id);
                }
                $event.stopPropagation();
            };

            $scope.toggleEdit = function ($event, swimlane) {
                $event.stopPropagation();
                if (swimlane.$edit) {
                    swimlane.cancelEdit();
                } else {
                    swimlane.edit();
                }
            };
        }
    };
});
angular.module('component.task-groups.task-group').directive('deltaDragHandler', ["$window", function ($window) {
    var $rootElement = angular.element($window.document.documentElement);

    function touchToMouse(e) {
        var firstTouch = e.touches[0];
        firstTouch.preventDefault = function () {
            e.preventDefault();
        };
        return firstTouch;
    }

    function DeltaDragHandler($element, callbacks) {
        angular.extend(this, callbacks);
        var eventObject = this;

        var scrollableElement = callbacks.scrollableElement;

        function dragListen(e) {
            var lastEvent = e;

            var originalPageX = e.pageX;
            var originalPageY = e.pageY;
            var initialLeft = scrollableElement.element.scrollLeft;
            var initialTop = scrollableElement.element.scrollTop;

            function sendDelta(e, fn, scroll) {
                var deltaX = e.pageX - originalPageX + scrollableElement.element.scrollLeft - initialLeft;
                var deltaY = e.pageY - originalPageY + scrollableElement.element.scrollTop - initialTop;
                fn(deltaX, deltaY, scroll);
                lastEvent = e;
            }

            function mouseMoveWrapper(e) {
                if (!eventObject.$moved) {
                    eventObject.$moved = true;
                    $element.css('z-index', 9999);
                    $rootElement.css('cursor', 'pointer');
                    eventObject.start();
                    if (scrollableElement) {
                        scrollableElement.watchMouse(function() {
                            sendDelta(lastEvent, eventObject.move, true);
                        });
                    }
                }
                sendDelta(e, eventObject.move);
            }

            function touchMove(e) { mouseMoveWrapper(touchToMouse(e));}

            $rootElement.bind('mousemove', mouseMoveWrapper);
            $rootElement.bind('touchmove', touchMove);

            function mouseUp() {
                $rootElement.unbind('mousemove', mouseMoveWrapper);
                $rootElement.unbind('touchmove', touchMove);
                $rootElement.unbind('mouseup', mouseUp);
                $rootElement.unbind('toucheEnd', mouseUp);
                if (eventObject.$moved) {
                    eventObject.$moved = false;
                    $rootElement.css('cursor', 'default');
                    $element.css('z-index', 0);
                    if (scrollableElement) {
                        scrollableElement.stopWatching();
                    }
                    sendDelta(lastEvent, eventObject.stop);
                } else {
                    eventObject.simpleClick();
                }
            }

            $rootElement.bind('mouseup', mouseUp);
            $rootElement.bind('touchend', mouseUp);
            e.preventDefault();
        }

        $element.bind('mousedown', dragListen);
        $element.bind('touchstart', function (e) {
            dragListen(touchToMouse(e));
        });
    }
    
    return function ($scope, $element, $attrs) {
        var watchOnce = $scope.$watch($attrs.deltaDragHandler, function(callbacks){
            watchOnce();
            if (callbacks.disabled) {return;}
            new DeltaDragHandler($element, callbacks); //jshint ignore: line
        });
    };
}]);
angular.module('component.task-groups.task-group').directive('resizeButton', ["$window", function ($window) {
    var $rootElement = angular.element($window.document.documentElement);
    var body = angular.element($window.document.body);
    return function ($scope, $element, $attrs) {
        function mouseUp() {
            $rootElement.unbind('mouseup', mouseUp);
            $rootElement.unbind('touchend', mouseUp);
            $scope[$attrs.resizeButton] = false;
            body.css('cursor', 'default');
        }

        function mouseDown() {
            $rootElement.bind('mouseup', mouseUp);
            $rootElement.bind('touchend', mouseUp);
            $scope[$attrs.resizeButton] = true;
            $scope.resize = true;
            body.css('cursor', 'col-resize');
        }

        $element.bind('mousedown', mouseDown);
        $element.bind('touchstart', mouseDown);
    };
}]);
angular.module('component.task-groups.task-group').directive('taskGroup', ["$timeout", "$window", "taskGroupModal", function ($timeout, $window, taskGroupModal) { //jshint ignore: line
    var SNAP_SENSITIVITY = 0.2;

    function snapValue(val, sensivity) {
        var ending = Math.abs(val % 1);
        if (1 - sensivity >= ending && ending >= sensivity) {
            return val;
        } else {
            return Math.round(val);
        }
    }

    return {
        replace: true,
        transclude: true,
        scope: {
            group: '=',
            width: '=',
            settings: '=',
            columns: '='
        },
        require: ['^taskGroupList', '^scrollableElement'],
        link: function ($scope, $element, ignored, require) {
            var taskGroupList = require[0];
            var scrollableElement = require[1];
            var groupWidth = $scope.width;

            function setLeft(leftPx) {$element.css({'margin-left': leftPx * groupWidth + 'px'});}

            function setWidth(width) {$element.css('width', width * groupWidth + 'px');}

            $scope.$watch('group.$lineSpace', setLeft);
            $scope.$watch('group.width', setWidth);

            $scope.$watch('group.$recalculated', function (value) {
                if (value) {
                    delete $scope.group.$recalculated;
                    taskGroupList.recalculatePositions();
                }
            });

            var group = $scope.group;
            $scope.$watch('group.$highlightedGroup', function (value) {
                if (value) {
                    taskGroupList.highlightGroup(group);
                }
            });
            var initialWidth, initialLeft, clone;

            var wasResize = false;
            var maxSnap;
            $scope.dragHandler = {
                simpleClick: function () {
                    if (group.$expandedGroup) {
                        taskGroupModal.open(group, $scope.settings).result.then(function () {
                            group.remove();
                            taskGroupList.removeGroup(group);
                        });
                    } else {
                        taskGroupList.cleanExpanded(group);
                    }
                    taskGroupList.highlightGroup(group);
                },
                scrollableElement: scrollableElement,
                start: function () {
                    if ($scope.settings.readOnly) {return;}
                    $scope.$apply(function () {
                        group.highlightTasks(true);
                        taskGroupList.highlightGroup(group);
                    });
                    clone = $element.clone();
                    clone.children().css({borderColor: group.color}).addClass('opacity');
                    $element.after(clone).addClass('draggy');
                    clone.parent().prepend($element);
                    initialLeft = group.start;
                    initialWidth = group.width;
                    maxSnap = $scope.columns.length - (group.start + group.width);
                },
                move: function (deltaX, deltaY, scroll) {
                    if ($scope.settings.readOnly) { return;}
                    var elementHeight = $element.prop('offsetHeight');
                    clone.parent().css({'margin-top': elementHeight + 'px'});
                    $element.css({'margin-top': -elementHeight + 'px'});
                    var snapX;
                    if (scroll) {
                        snapX = deltaX / groupWidth;
                    } else {
                        snapX = snapValue(deltaX / groupWidth, SNAP_SENSITIVITY);
                    }
                    snapX = Math.min(snapX, maxSnap);
                    if ($scope.resize) {
                        wasResize = true;
                        var newWidth = initialWidth + snapX;
                        if (newWidth >= 1) {
                            group.width = newWidth;
                        }
                    } else {
                        group.start  = Math.max(0, initialLeft + snapX);
                    }

                    setLeft(group.start);
                    setWidth(group.width);
                },
                stop: function (deltaX) { //jshint ignore:line
                    if ($scope.settings.readOnly) {return;}

                    var snapX = Math.round(deltaX / groupWidth);
                    if (snapX) {
                        snapX = Math.min(snapX, maxSnap);
                        if (wasResize) {
                            group.width = initialWidth + snapX;
                            if (group.width < 1) {
                                group.width = 1;
                            }
                            group.expand();
                        } else {
                            group.start = initialLeft + snapX;
                            if (group.start <= 0) {
                                group.start = 0;
                                group.shrink(-initialLeft);
                            } else {
                                group.shrink(snapX);
                            }
                        }
                        group.$lastTouched = true;
                    } else {
                        group.width = initialWidth;
                        group.start = initialLeft;
                        setLeft(group.start);
                        setWidth(group.width);
                        wasResize = false;
                    }
                    clone.parent().css('margin-top', 0);
                    $element.css('margin-top', 0);
                    $element.after(clone).removeClass('draggy');
                    clone.remove();
                    taskGroupList.recalculatePositions();
                    $scope.$apply();
                }

            };
            $scope.getStyle = function (group, isHighlighted) {
                return {
                    'backgroundColor': isHighlighted ? group.color : angular.noop,
                    'borderColor': group.color
                };
            };
        },
        templateUrl: 'app/component/task-groups/task-group/task-group.html'
    };
}]);
angular.module('component.task-groups.task-group-list', [
]).directive('taskGroupList', function () {
    function add(line, group) {
        group.$lineSpace = group.start - line.width;
        line.width = group.$width;
        delete group.$width;

        line.groups.push(group);
    }

    return {
        scope: {groups: '=', columns: '=', isExpanded: '=', settings: '='},
        replace: true,
        controllerAs: 'taskGroupList',
        templateUrl: 'app/component/task-groups/task-group-list/task-group-list.html',
        controller: ["$scope", "$log", function ($scope, $log) {
            this.cleanExpanded = function (group) {
                if (!$scope.settings.allowGroupExpand) {return;}
                $scope.groups.forEach(function (group) {
                    group.highlightTasks(false);
                    delete group.$expandedGroup;
                    delete group.$highlightedGroup;
                });
                group.$expandedGroup = true;
                group.highlightTasks(true);
                $scope.$apply();
            };

            this.addGroup = function(){
                $scope.$emit('kanban:add-group');
            };

            this.highlightGroup = function (group) {
                $scope.groups.forEach(function (group) {
                    group.highlightTasks(false);
                    delete group.$highlightedGroup;
                });
                group.highlightTasks(true);
                group.$highlightedGroup = true;
                $scope.$evalAsync();
            };

            this.removeGroup = function (group) {
                $scope.groups.splice($scope.groups.indexOf(group), 1);
                this.recalculatePositions();
            };

            this.recalculatePositions = function () {
                var lines = [];

                function createLine() {
                    var line = {width: 0, groups: []};
                    lines.push(line);
                    return line;
                }

                var maxVal = $scope.columns.length, index = 0;

                ($scope.groups || []).map(function (group) {
                    return group;
                }).filter(function(group){
                    if (group.start > maxVal - 1) {
                        $log.warn('Start position of group with id ' + group.id + ' is out of columns range');
                        return false;
                    }
                    return true;
                }).sort(function (a, b) {
                    return a.start > b.start ? 1 : -1;
                }).forEach(function (group) {
                    var hasNoLine = true;
                    if (!group.tasks.length && !group.$emptyButPositioned) {
                        if (!$scope.columns[index]) {
                            index = 0;
                        }
                        if (angular.isUndefined(group.start)) {
                            group.start = index;
                            index++;
                        }
                        group.width = group.width || 1;
                        group.$emptyButPositioned = true;
                    }
                    group.$width = group.start + group.width;
                    lines.forEach(function (line) {
                        if (hasNoLine) {
                            if (line.width <= group.start && line.width <= maxVal) {
                                add(line, group);
                                hasNoLine = false;
                            }
                        }
                    });
                    if (hasNoLine) {
                        add(createLine(), group);
                    }
                });
                $scope.lines = lines;
            };

            var that = this;
            $scope.$watch('groups', function (groups) {
                if (groups) {
                    that.recalculatePositions();
                }
            });
        }]
    };
});
angular.module('component.task-groups.task-groups-button', [
]).directive('taskGroupsButton', function(){
   return {
       replace: true,
       scope: {value: '=',settings: '='},
       templateUrl: 'app/component/task-groups/task-groups-button/task-groups-button.html'
   };
});
angular.module('ie-9-fixes', []).factory('fixIE9', ["$window", function ($window) {
    var isIE9 = $window.navigator.appVersion.indexOf('MSIE 9') !== -1;
    var document = $window.document;
    if (isIE9) {
        document.body.className = document.body.className + ' lt-ie9';
    }

    var shims = {
        'unselect-text': function clearSelection() {
            if (document.selection && document.selection.empty) {
                document.selection.empty();
            } else if ($window.getSelection) {
                var sel = $window.getSelection();
                sel.removeAllRanges();
            }
        },
        'kanban-columns-fix': function () {
            angular.forEach(document.getElementsByClassName('kanban-board'), function (board) {
                var columnsList = Array.prototype.slice.call(board.querySelectorAll('[kanban-column]'));
                var max = columnsList.reduce(function (p, e) {
                    return e.scrollHeight > p ? e.scrollHeight : p;
                }, 0);
                angular.element(columnsList).css('height', max + 'px');
            });
        }
    };

    return function (fixName) {
        if (isIE9) {
            shims[fixName]();
        }
    };
}]);

angular.module('kanban').factory('globalOnEsc', ["$window", function ($window) {
    var $body = angular.element($window.document.body);
    return function (fn) {

        function onEscPressed(e) {
            if (e.which === 27) { fn();}
        }

        $body.bind('keyup', onEscPressed).bind('click', fn);
        return function () {
            $body.unbind('keyup', onEscPressed).unbind('click', fn);
        };
    };
}]);

angular.module('component.is-touch', [
]).provider('isTouch', function () {
    this.$get = ["$window", function ($window) {
        return (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/).test($window.navigator.userAgent);
    }];
}).factory('isNotTouch', ["isTouch", function(isTouch){
    return !isTouch;
}]);
angular
    .module('component.kanban-card')
    .constant('kanbanCardFields', {
        'rliDevType': false,
        'priority': false,
        'grade': false,
        'id': false,
        'notes': false,
        'flag': false,
        'mediaFlag': false,
        'preview': false,
        'primarySlot': false,
        'appRef': false,
        'appName': false,
        'resourceName': false,
        'assignees': false,
        'rating': false,
        'modifiedDate': false,
        'creationDate': false,
        'ownerAppLogo': false,
        'taskName': false,
        'description': false,
        'assignability': false,
        'type': false,
        'ownerName': false,
        'assigneeName': false,
        'ownerPicture': false,
        'state': false
    });
angular.module('component.kanban-model').value('KanbanColumn', (function () {
    function KanbanColumn(columnData) {
        angular.extend(this, columnData);
    }

    KanbanColumn.prototype = {
        removeTask: function (task) {
            var index = this.tasks.indexOf(task);
            if (index !== -1) {
                this.tasks.splice(index, 1);
            }
            this.swimlane.$tasksCount--;
        },
        collapse: function () {
            this.$collapsed = true;
            this.$disabled = true;
        },
        expand: function () {
            this.$collapsed = false;
            this.$disabled = false;
        }
    };

    return KanbanColumn;

})());
angular.module('component.kanban-model').factory('KanbanGroup', function () {
    function KanbanGroup(groupData) {
        angular.extend(this, groupData);
    }

    KanbanGroup.prototype = {
        highlightTasks: function (bool) {
            this.tasks.forEach(function (task) {
                task.$highlight = bool;
            });
        },
        shrink: function (delta) {
            this.tasks.forEach(function (task) {
                task.moveToColumn(task.column.swimlane.columns[task.column.index + delta], true);
            });
        },
        expand: function () {
            var swimLanes = {};
            this.tasks.forEach(function(task){
                if (!swimLanes[task.column.swimlane.id]){
                    swimLanes[task.column.swimlane.id] = [task];
                } else {
                    swimLanes[task.column.swimlane.id].push(task);
                }
            });

            var start = this.start;
            var end = this.width;

            angular.forEach(swimLanes, function(tasks){
                tasks.forEach(function(task, index){
                    task.moveToColumn(task.column.swimlane.columns[start + index % end], true);
                });
            });
        },
        recalculate: function (skipFlag) {
            if (this.tasks.length) {
                var minIndex = Number.MAX_VALUE;
                var maxIndex = 0;
                this.tasks.forEach(function (task) {
                    var columnIndex = task.column.index;
                    if (columnIndex > maxIndex) {
                        maxIndex = columnIndex;
                    }
                    if (columnIndex < minIndex) {
                        minIndex = columnIndex;
                    }
                });
                this.start = minIndex;
                this.width = maxIndex - minIndex + 1;
            }

            if (!skipFlag) {
                this.$recalculated = true;
            }
        },
        remove: function(){
            this.tasks.forEach(function(task){
               task.removeFromColumn();
            });
        }
    };

    return KanbanGroup;
});

angular.module('component.kanban-model').value('KanbanSwimlane', (function () {
    function KanbanSwimlane(swimlaneData) {
        angular.extend(this, swimlaneData);
    }

    KanbanSwimlane.prototype = {
        edit: function () {
            this.$edit = true;
            this.$disabled = true;
            this.columns.forEach(function (column) {
                column.tasks.forEach(function (task) {
                    task.$edit = true;
                    task.$highlight = false;
                });
            });
        },
        cancelEdit: function () {
            this.$edit = false;
            this.$disabled = false;
            this.columns.forEach(function (column) {
                column.tasks.forEach(function (task) {
                    task.$edit = false;
                });
            });
        }
    };

    return KanbanSwimlane;

})());
angular.module('component.kanban-model').factory('KanbanTask', ["$rootScope", function ($rootScope) {
    var uniqueId = 0;
    function KanbanTask(taskData) {
        angular.extend(this, taskData);
        this.$uniqueId = uniqueId++;
    }

    KanbanTask.prototype = {
        attachToGroup: function(group){
            group.tasks.push(this);
            this.group = group;
            this.groupId = group.id;
        },
        attachToColumn: function(column, skip){
            this.column = column;
            if (column.tasks.indexOf(this) === -1) {
                column.tasks.push(this);
            }
            this.columnId = column.id;
            this.swimlaneId = column.swimlaneId;
            column.swimlane.$tasksCount++;
            if (angular.isDefined(this.group) && !skip) {
                this.group.recalculate();
            }
        },
        removeFromColumn: function () {
            this.column.removeTask(this);
            return this;
        },
        moveToColumn: function(column, skip){
            if (column === this.column) {
                return;
            }
            $rootScope.$broadcast('kanban:task:moved', this.id, this.column.id, column.id, this.column.swimlane.id, column.swimlane.id);

            this.removeFromColumn().attachToColumn(column, skip);
        },
        replace: function(newTaskData) {
            var clonedTask = new KanbanTask(this);
            angular.extend(clonedTask, newTaskData);
            this.column.tasks[this.column.tasks.indexOf(this)] = clonedTask;
            if (this.group) {
                this.group.tasks[this.group.tasks.indexOf(this)] = clonedTask;
            }
            this.$$remove();
            return clonedTask;
        },
        $$remove: function(){
            this.group = undefined;
            this.column = uniqueId;
        },
        remove: function(){
            this.removeFromColumn();
            if (this.group) {
                this.group.tasks.splice(this.group.tasks.indexOf(this), 1);
                this.group.recalculate();
            }
            this.$$remove();
            return this;
        },
        clone: function () {
            var clonedTask = new KanbanTask(this);
            clonedTask.taskName += ' (Copy)';
            if (this.group) {
                this.group.tasks.push(clonedTask);
            }
            this.column.tasks.push(clonedTask);
            this.column.swimlane.$tasksCount++;
            return clonedTask;
        }
    };

    return KanbanTask;
}]);

angular.module('component.kanban-model').factory('generateKanbanModel', ["KanbanGroup", "KanbanTask", "KanbanColumn", "KanbanSwimlane", function (KanbanGroup, KanbanTask, KanbanColumn, KanbanSwimlane) {
    return function createKanbanModel(initialConfig) {
        var config = angular.copy(initialConfig);
        config.$loaded = false;

        if (angular.isDefined(initialConfig.tasks)) {
            angular.extend(config, {
                tasks: initialConfig.tasks.map(function (task) {
                    return new KanbanTask(task);
                })
            });
        }
        if (angular.isDefined(initialConfig.groups)) {
            angular.extend(config, {
                groups: initialConfig.groups.map(function (group) {
                    return new KanbanGroup(group);
                })
            });
        }
        if (angular.isDefined(initialConfig.columns)) {
            angular.extend(config, {
                columns: initialConfig.columns.map(function (column) {
                    return new KanbanColumn(column);
                })
            });
        }
        if (angular.isDefined(initialConfig.swimlanes)) {
            angular.extend(config, {
                swimlanes: initialConfig.swimlanes.map(function (swimlane) {
                    return new KanbanSwimlane(swimlane);
                })
            });
        }
        if (angular.isDefined(config.groups)) {
            config.groups.forEach(function (group) {
                group.tasks = [];
                group.tasks = config.tasks.filter(function (task) {
                    return task.groupId === group.id;
                });
                group.tasks.forEach(function (task) {
                    task.group = group;
                });
            });
        }
        if (angular.isDefined(config.columns)) {
            config.columns.forEach(function (column, index) {
                column.index = index;
            });
        }

        if (angular.isDefined(config.swimlanes)) {
            config.swimlanes.forEach(function (swimlane) {
                swimlane.columns = angular.copy(config.columns);
                swimlane.columns.forEach(function (column) {
                    column.swimlane = swimlane;
                    column.tasks = config.tasks.filter(function (task) {
                        return task.columnId === column.id && task.swimlaneId === swimlane.id;
                    });
                    column.tasks.forEach(function (task) {
                        task.column = column;
                    });
                });
            });
        }

        if (angular.isDefined(config.groups)) {
            config.groups.forEach(function (group) {
                angular.extend(group, {
                    visible: true,
                    expanded: true,
                    groupId: group.id,
                    members: group.tasks
                });

                group.tasks.forEach(function (task) {
                    angular.extend(task, {
                        createdDate: task.creationDate,
                        title: task.resourceName
                    });
                });

                group.recalculate(true);
            });
        }

        config.$loaded = true;

        return config;
    };
}]);
angular.module('component.kanban-model').directive('kanbanModel', ["generateKanbanModel", "KanbanTask", "$parse", function (generateKanbanModel, KanbanTask, $parse) {
    return function ($scope, $element, $attrs) {
        $scope.$on('addToGroup', function (e, group, task) {
            var config = $parse($attrs.model)($scope);
            var firstColumn = config.swimlanes[0].columns[0];
            task = new KanbanTask(task);
            task.attachToGroup(group);
            task.attachToColumn(firstColumn);
            config.tasks.push(task);
            task.resourceName = task.title.text;
            group.recalculate();
        });

        $scope.$on('update:kanban:card', function (e, newCard) {
            var config = $parse($attrs.config + '.tasks')($scope);
            if (!config || !config.length || !newCard || !newCard.id) {return;}
            var task = config.filter(function (oldCard) {return oldCard.id === newCard.id;})[0];
            var model = $parse($attrs.model + '.tasks')($scope);
            var modelTask = model.filter(function (modelTask) {return modelTask.id === newCard.id;})[0];
            if (!task || !modelTask) {return;}

            model[model.indexOf(modelTask)] = modelTask.replace(angular.extend(task, newCard));
        });

        $scope.$watch($attrs.config, function (config) {
            var model = $parse($attrs.model);
            if (config) {
                model.assign($scope, generateKanbanModel(config));
            } else {
                model.assign($scope, null);
            }
        });
    };
}]);
angular.module('component.sanitize-filter', [
    'ngSanitize'
]).filter('sanitize', ["$sce", function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);
angular.module('component.scrollable-element').factory('ScrollableElementFactory', ["$interval", function ($interval) {
    var CHECK_INTERVAL_MILLIS = 16.66;
    var MINIMAL_VALUE_TO_SCROLL = 25;

    function ScrollableElementFactory(fn) {
        this.fn = fn;
    }

    ScrollableElementFactory.prototype = {
        stopInterval: function () {
            if (this.interval) {
                $interval.cancel(this.interval);
                this.interval = null;
            }
        },
        dotReady: function () {
            return this.x || this.y;
        },
        minValue: function (value) {
            if (value) {
                if (value > 0) {
                    value = Math.max(value, MINIMAL_VALUE_TO_SCROLL);
                } else {
                    value = Math.min(value, -MINIMAL_VALUE_TO_SCROLL);
                }
            }
            return value;
        },
        runInterval: function () {
            var that = this;
            if (!this.interval) {
                this.interval = $interval(function () {
                    if (that.dotReady()) {
                        that.fn(that.minValue(that.x), that.minValue(that.y));
                    } else {
                        that.stopInterval();
                    }
                }, CHECK_INTERVAL_MILLIS, 0, false);
            }
        },
        scrollIfNecessary: function (e) {
            this.calculateDot(e);
            if (this.dotReady()) {
                this.runInterval();
            }
        }
    };
    return ScrollableElementFactory;
}]);

angular.module('component.modals.confirmation-modal', [
    //TODO: Stan, move dependencies and $scope.$on('destroy') into a commod dir;
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).factory('openConfirmationModal', ["$modal", function ($modal) {
    return function ($scope) {
        var modal = $modal.open({
            windowClass: 'tiny confirmation-modal',
            templateUrl: 'app/component/modals/confirmation-modal/confirmation-modal.html',
        });

        if ($scope) {
            $scope.$on('$destroy', function () {
                if (modal) { modal.dismiss('cancel'); }
            });
        }

        return modal.result.finally(function () {
            modal = null;
        });
    };
}]);
angular.module('component.modals.task-card-modal', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).factory('openTaskCard', ["$modal", function ($modal) {
    return function (task, settings) {
        return $modal.open({
            windowClass: 'tiny task-card-modal',
            templateUrl: 'app/component/modals/task-card-modal/task-card-modal.html',
            controller: 'TaskCardModalController',
            resolve: {
                task: function () {return task;},
                settings: function () {return settings;}
            }
        }).result;
    };
}]).controller('TaskCardModalController', ["$scope", "$rootScope", "$modalInstance", "$location", "task", "settings", function ($scope, $rootScope, $modalInstance, $location, task, settings) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.task = task;
    $scope.settings = settings;

    $scope.copy = function (task) {
        task.clone();
        $modalInstance.dismiss('cancel');
    };

    $scope.removeCard = function (task) {
        task.remove();
        $rootScope.$broadcast('kanban:task:remove', task.id);

        //close up modal as well
        $modalInstance.dismiss('cancel');
    };

    $scope.openURL = function(task) {
        $rootScope.$broadcast('kanban:openURL',task.resourceId);
    };

}]);
angular.module('component.modal.task-group-modal', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).factory('taskGroupModal', ["$modal", function ($modal) {
    return {
        open: function (group, settings) {
            return $modal.open({
                windowClass: 'tiny task-group-modal',
                templateUrl: 'app/component/modals/task-group-modal/task-group-modal.html',
                resolve: {
                    group: function(){
                        return group;
                    },
                    settings: function(){
                        return settings;
                    }
                },
                controllerAs: 'modal',
                controller: ["$scope", "$modalInstance", "group", "settings", function ($scope, $modalInstance, group, settings) {
                    this.settings = settings;
                    this.group = group;
                    this.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    this.delete = function(){
                        $modalInstance.close('delete');
                    };
                }]
            });
        }
    };
}]);
angular.module("kanban.templates").run(["$templateCache", function($templateCache) {$templateCache.put("app/kanban.html","<div class=\"kanban\"\n     ng-class=\"{\'kanban-read-only\': config.settings.readOnly,\n                \'kanban-touch\': isTouch}\"\n     ng-show=\"config.$loaded\"\n     combine-horizontal-scrolls>\n    <kanban-header groups=\"config.groups\"\n                   columns=\"config.columns\"\n                   settings=\"config.settings\">\n    </kanban-header>\n    <swim-lane id=\"swimlane-{{::$index}}\"\n               ng-repeat=\"swimlane in config.swimlanes\"\n               swimlane=\"swimlane\"\n               groups=\"config.groups\"\n               settings=\"config.settings\"\n               ng-init=\"swimlane.index = $index\">\n    </swim-lane>\n</div>");
$templateCache.put("app/component/add-dropdown/add-dropdown.html","<div class=\"add-dropdown\" ng-class=\"{\'no-groups\': !groups.length}\">\n    <button class=\"button\" dropdown-toggle=\"#add-choices\">Add New\n        <glyph-icon icon=\"\'glyph-chevron-collapsed\'\"></glyph-icon>\n        <glyph-icon icon=\"\'glyph-chevron-expanded\'\"></glyph-icon>\n    </button>\n    <ul id=\"add-choices\" class=\"add-dropdown-list\">\n        <li ng-repeat=\"linkItem in settings.addResourceLinks\" class=\"add-dropdown-item\">\n            <a href=\"{{linkItem.link}}\" target=\"_blank\">{{linkItem.linkText}}</a>\n        </li>\n    </ul>\n</div>");
$templateCache.put("app/component/add-new-control/add-new-control.html","<div class=\"add-menu-control text-right\">\n    <button ng-click=\"menuVisible = !menuVisible\" class=\"menu-width\">\n        Add new\n    </button>\n    <div ng-show=\"menuVisible\" ng-click=\"menuVisible = false\" class=\"menu-width menu-items\">\n        <div ng-click=\"addGroup()\" class=\"menu-item\">Add group</div>\n        <div ng-click=\"addTask()\" class=\"menu-item\">Add task</div>\n    </div>\n</div>\n");
$templateCache.put("app/component/column-names/column-names.html","<div class=\"column-names\">\n    <div class=\"column-name\" ng-repeat=\"column in columns\" ng-class=\"{\'column-name-collapsed\' : column.$collapsed}\" ng-click=\"toggleColumn(column)\">\n        <div class=\"tooltip-area\" ng-show=\"column.$collapsed\" tooltip=\"{{column.name}}\" tooltip-animation=\"false\" tooltip-placement=\"bottom\" tooltip-append-to-body=\"true\" tooltip-trigger=\"mouseenter\"></div>\n        <span class=\"column-toggle-icon\" ng-show=\"settings.showHideColumns\">\n            <span class=\"glyph-icon priority-icon\">\n                <span class=\"glyph-contract3\" ng-hide=\"column.$collapsed\"></span>\n                <span class=\"glyph-expand3\" ng-show=\"column.$collapsed\"></span>\n            </span>\n        </span>\n        <span class=\"title\" title=\"{{column.$collapsed ? column.name : \'\'}}\">{{column.name}}</span>\n    </div>\n</div>");
$templateCache.put("app/component/glyph-icon/glyph-icon.html","<span class=\"glyph-icon\" ng-if=\"icon\">\n    <span ng-class=\"icon\"></span>\n</span>");
$templateCache.put("app/component/kanban-board/kanban-board.html","<div class=\"kanban-board\" horizontal-scroll scrollable-element ng-class=\"::{\'team-kanban\': swimlane.isTeam, \'not-team-kanban\': !swimlane.isTeam}\"\n        ng-style=\"::{\'max-height\': settings.swimlaneMaxHeight || \'620px\'}\">\n    <div class=\"empty-placeholder\" ng-hide=\"swimlane.isTeam || swimlane.$tasksCount || settings.readOnly || settings.disableDefaultMessaging || settings.allowEmptySwimlanes\">\n        <p>{{::swimlane.addAlertText}}</p>\n        <button class=\"button blue select-skills-button\" ng-click=\"addResources()\" ng-show=\"::swimlane.addButtonText\">{{::swimlane.addButtonText}}</button>\n    </div>\n    <div class=\"team-message\" ng-model=\"column.tasks\" data-as-sortable=\"scrollCallbacks\" ng-show=\"swimlane.isTeam\">\n        Drop here to assign card to this team. <br/>\n        Card will remain in the same workflow state column.\n    </div>\n    <div class=\"kanban-wrapper\">\n        <div ng-repeat=\"column in swimlane.columns\"\n             kanban-column\n             class=\"kanban-clmn\"\n             ng-model=\"column.tasks\"\n             data-as-sortable=\"scrollCallbacks\"\n             ng-class=\"{\'kanban-clmn-barred\': column.$barred, \'kanban-clmn-collapsed\': column.$collapsed}\"\n             ng-if=\"!swimlane.isTeam\"\n             is-disabled=\"{{swimlane.$disabled || settings.readOnly}}\">\n        </div>\n    </div>\n</div>");
$templateCache.put("app/component/kanban-board/kanban-delete-message.html","<div class=\"kanban-notify cg-notify-message cg-notify-message-center\">{{$message}}</div>");
$templateCache.put("app/component/kanban-card/kanban-card.html","<div class=\"card-wrapper\" ng-lazy-click=\"clickCallbacks(task, $event, false)\"\n     ng-mousedown=\"highlightTask(task, $event)\"\n     data-as-sortable-item-handle>\n    <div class=\"card-color\" ng-if=\"::groupColor\" ng-style=\"::{\'background\': groupColor}\"></div>\n    <button class=\"button card-button delete-card-button\" type=\"button\"\n            ng-click=\"deleteTask($event, task)\"\n            ng-if=\"::!task.published\"\n            ng-show=\"task.$edit\">\n        <span class=\"glyph-icon\"><span class=\"glyph-close\"></span></span>\n    </button>\n    <div class=\"card-header\">\n        <div class=\"card-handle\"></div>\n        <div class=\"app-tag\" ng-if=\"::fields.appRef\">\n            <span class=\"glyph-icon card-icon\"><span ng-class=\"::task.appRef\"></span></span>\n        </div>\n        <div class=\"card-title\" ng-if=\"::fields.appName\">\n            <span class=\"card-name\">{{::task.appName}}</span>\n        </div>\n        <div class=\"card-title\" ng-if=\"::fields.rliDevType\">\n            <span class=\"card-name\">{{::task.rliDevType.name}}</span>\n        </div>\n    </div>\n    <div class=\"card-content\">\n        <p class=\"task-name\" ng-if=\"::fields.taskName\" ng-bind-html=\"::task.taskName | sanitize\"></p>\n        <p class=\"task-name\" ng-if=\"::fields.primarySlot\" ng-bind-html=\"::task.primarySlot | sanitize\"></p>\n        <p class=\"task-description\" ng-if=\"::fields.description\">{{::task.description}}</p>\n        <hr class=\"card-divider\" ng-if=\"::(fields.taskName || fields.primarySlot)\"/>\n        <p ng-if=\"::fields.ownerAppLogo\"><img class=\"owner-logo\" ng-src=\"{{::task.ownerAppLogo}}\"/></p>\n        <p ng-if=\"::fields.assignees\" ng-style=\"::{color: task.assigneesColor}\">\n            <span class=\"task-assignee\">{{::task.assignees}}</span>\n        </p>\n        <div class=\"additional-details\">\n            <div class=\"task-owner\" ng-if=\"::fields.assigneeName\">\n                <p class=\"owner-avatar\" ng-if=\"::fields.ownerPicture\"><img ng-src=\"{{::task.ownerPicture}}\"/></p>\n                <p class=\"owner-name\">{{::task.assigneeName}}</p>\n            </div>\n            <p ng-if=\"::fields.rating\">\n                <star-rating value=\"::task.rating\"></star-rating>\n            </p>\n            <p ng-if=\"::fields.state\" class=\"text-bold text-grey\">\n                <span>{{::task.state}}</span>\n                <span ng-if=\"::fields.assignability\">&nbsp;-&nbsp;Locked</span>\n                <span class=\"glyph-icon card-icon\" ng-if=\"::task.assignability\"><span class=\"glyph-lock3\"></span></span>\n            </p>\n            <!--we don\'t need to show task.id, but alfrescoDbId, and only if it exists 18.12.2015 -->\n            <p ng-if=\"::task.alfrescoDbId\"><span class=\"text-grey text-left\">ID#&nbsp;</span>{{::task.alfrescoDbId}}</p>\n            <p ng-if=\"::fields.grade\">\n                    <span class=\"text-grey text-left\">Grade&nbsp;</span>\n                    <span ng-repeat=\"grade in ::task.grades\">{{::grade.name}}{{::$last ? \'\' : \', \'}}</span>\n            </p>\n            <p ng-if=\"::fields.notes\" class=\"text-grey\">\n                <span>{{task.notes | limitTo: limit}} </span>\n                <span class=\"card-ellipsis\" ng-show=\"task.notes.length > limit\" ng-click=\"showFullDescription(task, settings, $event)\">[&hellip;]</span>\n            </p>\n            <p ng-if=\"::fields.ownerName\"><span class=\"text-bold\">Owner:&nbsp;</span>{{::task.ownerName}}</p>\n            <p ng-if=\"::fields.type\"><span class=\"text-bold\">Type:&nbsp;</span>{{::task.type}}</p>\n            <p ng-if=\"::fields.assignability\"><span class=\"text-bold\">Assignability:&nbsp;</span><span>{{::task.assignability ? \'Locked\' : \'Available\'}}</span></p>\n            <p ng-if=\"::fields.creationDate\" class=\"task-date\"><span class=\"text-grey text-bold\">Created:&nbsp;</span>{{::task.creationDate | date : \"MMM d, y \'at\' h:mma\"}}<p>\n            <p ng-if=\"::fields.modifiedDate\" class=\"task-date\"><span class=\"text-grey text-bold\">Modified:&nbsp;</span>{{::task.modifiedDate | date : \"MMM d, y \'at\' h:mma\"}}</p>\n            <div class=\"card-footer clearfix\" ng-if=\"::(fields.priority || fields.flag || fields.preview)\">\n                <hr class=\"card-divider\"/>\n                <p ng-if=\"::fields.priority\" class=\"text-left\"><priority-level value=\"::task.priority._id\"></priority-level></p>\n                <div class=\"text-right\">\n                    <span class=\"glyph-icon card-icon\" ng-if=\"::(fields.flag || fields.mediaFlag)\">\n                        <span class=\"task-flag glyph-flag\" ng-if=\"::(task.flag._id === \'AUTHFLAG_TRUE\')\"></span>\n                        <span class=\"task-flag glyph-images2\" ng-if=\"::(task.mediaFlag._id === \'MEDFLAG_TRUE\')\"></span>\n                    </span>\n                    <button ng-if=\"::(fields.preview && task.preview)\" type=\"button\" class=\"button card-preview\"\n                            ng-lazy-click=\"clickCallbacks(task, $event, true)\">\n                        <span class=\"glyph-icon\"><span class=\"glyph-eye\"></span></span>\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"edit-wrapper\"></div>\n</div>\n");
$templateCache.put("app/component/kanban-card/tip-template.html","<div>\n    <div class=\"skills-title\">\n        {{::skills.length - 1}} Skill<span ng-show=\"::skills.length !== 2\">s</span>\n    </div>\n    <div class=\"skills-description\">\n        <div ng-repeat=\"skill in skills\" class=\"clearfix\" ng-show=\"$index\">\n            <span class=\"title\" ng-bind-html=\"skill.name\"></span>\n        </div>\n    </div>\n</div>");
$templateCache.put("app/component/kanban-column/kanban-column.html","<div class=\"kanban-clmn-warning\">\n    <glyph-icon icon=\"\'glyph-warning2\'\"></glyph-icon>\n    {{::settings.barredColumnMessage}}\n</div>\n<kanban-card class=\"kanban-card as-sortable-item\"\n             ng-repeat=\"task in column.tasks | limitTo: limit track by task.$uniqueId\"\n             data-as-sortable-item></kanban-card>\n");
$templateCache.put("app/component/kanban-header/kanban-header.html","<add-dropdown settings=\"settings\" groups=\"groups\" ng-show=\"settings.showAddNew\"></add-dropdown>\n<div class=\"kanban-header-wrapper\" sticky-header>\n    <scrollbar columns=\"columns\" horizontal-scroll></scrollbar>\n    <div class=\"kanban-header\" scrollable-element horizontal-scroll>\n        <column-names columns=\"columns\" settings=\"settings\"></column-names>\n        <task-group-list expand-collapse=\"expanded\"\n                         expand-disabled=\"settings.readOnly\"\n                         class=\"task-groups\"\n                         ng-hide=\"settings.hideGroups\"\n                         groups=\"groups\"\n                         columns=\"columns\"\n                         settings=\"settings\"\n                         columns-width></task-group-list>\n    </div>\n    <task-groups-button value=\"expanded\" ng-init=\"expanded = true\" settings=\"settings\" ng-hide=\"settings.hideGroups\"></task-groups-button>\n</div>");
$templateCache.put("app/component/priority-level/priority-level.html","<div class=\"priority-level\" ng-switch on=\"::value\">\n    <div class=\"high-priority\" ng-switch-when=\"AUTHPRI_HIGH\">\n        High&nbsp;\n        <span class=\"glyph-icon priority-icon\">\n            <span class=\"glyph-circle2\"></span>\n            <span class=\"glyph-circle2\"></span>\n            <span class=\"glyph-circle2\"></span>\n        </span>\n    </div>\n    <div class=\"medium-priority\" ng-switch-when=\"AUTHPRI_MED\">\n        Medium&nbsp;\n        <span class=\"glyph-icon priority-icon\">\n            <span class=\"glyph-circle2\"></span>\n            <span class=\"glyph-circle2\"></span>\n        </span>\n    </div>\n    <div class=\"low-priority\" ng-switch-when=\"AUTHPRI_LOW\">\n        Low&nbsp;\n        <span class=\"glyph-icon priority-icon\">\n            <span class=\"glyph-circle2\"></span>\n        </span>\n    </div>\n</div>");
$templateCache.put("app/component/scroll-bar/scroll-bar.html","<div class=\"scroll-bar\">\n    <div class=\"clmn\" ng-repeat=\"column in columns\" ng-class=\"{\'clmn-collapsed\': column.$collapsed}\"></div>\n</div>");
$templateCache.put("app/component/star-rating/star-rating.html","<ul class=\"star-rating\">\n    <li ng-repeat=\"star in stars\" class=\"star-list\" ng-class=\"star\">\n        <span class=\"glyph-icon\"><i class=\"glyph-star3\"></i></span>\n    </li>\n</ul>");
$templateCache.put("app/component/swim-lane/swim-lane.html","<div class=\"swim-lane\" ng-class=\"{\'empty\': !swimlane.$tasksCount && !settings.allowEmptySwimlanes, \'no-groups\': !groups.length, \'edit\': swimlane.$edit}\">\n    <div class=\"swim-lane-header swim-lane-toggle\" ng-click=\"toggleCollapse()\">\n    <span class=\"glyph-icon\" ng-hide=\"settings.readOnly\">\n        <span ng-class=\"{\'glyph-chevron-expanded\': swimlane.collapsed, \'glyph-chevron-collapsed\': !swimlane.collapsed}\"></span>\n    </span>\n        <span class=\"swim-title\">\n            <span ng-show=\"::swimlane.isTeam\">Assign To </span>\n            {{swimlane.name}}\n        </span>\n        <span class=\"swim-length\" ng-hide=\"::swimlane.isTeam\">({{swimlane.$tasksCount}})</span>\n        <span class=\"swim-loading\" ng-show=\"swimlane.$loading\">Loading &hellip;</span>\n        <div class=\"add-resource-button\" ng-show=\"!settings.readOnly && swimlane.addResourcesButtonText\" ng-click=\"addResource($event)\">\n            <span class=\"glyph-icon\"><i class=\"glyph-plus-circle2\"></i></span>\n            <button class=\"button\">{{swimlane.addResourcesButtonText}}</button>\n        </div>\n        <div class=\"edit-tasks-button\" ng-hide=\"swimlane.isTeam || settings.readOnly || !settings.editableSwimlanes\" ng-click=\"toggleEdit($event, swimlane)\">\n            <button class=\"button\" type=\"button\">{{swimlane.$edit ? \'Done\' : \'Edit Tasks\'}}</button>\n        </div>\n        <span class=\"swim-sub-title\">{{swimlane.subText}}</span>\n    </div>\n    <kanban-board swimlane=\"swimlane\" expand-collapse=\"!swimlane.collapsed\" expand-disabled=\"settings.readOnly\" settings=\"settings\" limit=\"cardLimit\"></kanban-board>\n</div>");
$templateCache.put("app/demo-code/groups-debug/groups-debug.html","<div class=\"kanban-debug\" ng-show=\"groups.length\">\n    <button ng-click=\"showDebug = !showDebug\">show debug</button>\n    <div ng-repeat=\"group in groups\" ng-click=\"showGroup = !showGroup\" ng-init=\"showGroup=true\" ng-show=\"showDebug\">\n        <b class=\"group-name\">\n            {{::group.groupName}}\n            [tasks: <span opacity-on-changed=\"group.tasks.length\" set-text=\"true\"></span>,\n            width: <span opacity-on-changed=\"group.width\" set-text=\"true\"></span>]\n        </b>\n        <div ng-repeat=\"task in group.tasks\" ng-show=\"showGroup\">\n            <b>{{task.taskName}}</b>\n            column: <i opacity-on-changed=\"task.column.name\" set-text=\"true\"></i>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("app/demo-code/layout-switcher/demo-modal.html","<iframe src=\"http://pudtsj.axshare.com/dropbox.html\" height=\"3700\" width=\"1000\"></iframe>");
$templateCache.put("app/demo-code/layout-switcher/layout-switcher.html","<div class=\"layout-switcher\">\n    <a ng-click=\"isOpened = true\" ng-hide=\"isOpened\">expand layout-switcher</a>\n    <a ng-click=\"isOpened = false\" ng-show=\"isOpened\">minimize layout-switcher</a>\n\n    <div ng-show=\"isOpened\" class=\"opacity-area\">\n        <label><input type=\"radio\" ng-model=\"hash.contentLevel\" value=\"minimum\"/>Minimum Content Level</label>\n        <label><input type=\"radio\" ng-model=\"hash.contentLevel\" value=\"medium\"/>Medium Content Level</label>\n        <label><input type=\"radio\" ng-model=\"hash.contentLevel\" value=\"maximum\"/>Maximum Content Level</label>\n        <hr/>\n        <label><input type=\"radio\" ng-model=\"hash.layout\" value=\"planner\"/>Planner</label>\n        <label><input type=\"radio\" ng-model=\"hash.layout\" value=\"planner-no-tasks\"/>Planner [no tasks]</label>\n        <label><input type=\"radio\" ng-model=\"hash.layout\" value=\"empty-planner\"/>Empty planner</label>\n        <label><input type=\"radio\" ng-model=\"hash.layout\" value=\"work-tracker\"/>Work Tracker</label>\n        <label><input type=\"radio\" ng-model=\"hash.layout\" value=\"work-tracker-perf\"/>Work Tracker 1000</label>\n        <label><input type=\"radio\" ng-model=\"hash.layout\" value=\"empty-work-tracker\"/>Empty Work Tracker</label>\n        <hr/>\n        <label><input type=\"checkbox\" ng-model=\"hash.readOnly\"/>Read Only</label>\n        <label><input type=\"checkbox\" ng-model=\"hash.empty\"/>Empty State</label>\n        <button ng-click=\"updateCard()\" ng-show=\"!hash.empty && hash.layout === \'work-tracker\'\">update first card</button>\n    </div>\n</div>\n");
$templateCache.put("app/component/modals/confirmation-modal/confirmation-modal.html","<h2 class=\"modal-title\">Delete Card\n    <a class=\"close-reveal-modal\" ng-click=\"$dismiss()\">&#215;</a>\n</h2>\n<div class=\"wrapper\">\n    <div class=\"modal-row\">\n        <div class=\"small-12 columns content\">\n            <glyph-icon icon=\"\'glyph-warning\'\" class=\"icon\"></glyph-icon>\n            You may want to confirm you\'ve selected the right card details by opening the dropbox.\n            Do you still want to delete card?\n        </div>\n    </div>\n    <div class=\"modal-row\">\n        <div class=\"column footer\">\n            <button class=\"button\" ng-click=\"$close()\">Yes</button>\n            <button class=\"button\" ng-click=\"$dismiss()\">No</button>\n        </div>\n    </div>\n</div>");
$templateCache.put("app/component/modals/task-card-modal/task-card-modal.html","<h2 class=\"modal-title\">{{settings.taskModalWindowTitle}}\n    <a class=\"close-reveal-modal\" ng-click=\"cancel()\">&#215;</a>\n</h2>\n<div class=\"wrapper\">\n    <div class=\"row\">\n        <div class=\"column small-12\">\n            <div class=\"header\">\n                <div class=\"app-tag\" ng-show=\"task.appRef\">\n                    <glyph-icon icon=\"task.appRef\" class=\"card-icon\"></glyph-icon>\n                </div>\n                <div class=\"title\" ng-show=\"settings.tasksDisplayFields.appName\">{{task.appName}}</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"column small-12\">\n            <div class=\"name\">\n                <span ng-show=\"settings.tasksDisplayFields.resourceName\" ng-bind-html=\"task.resourceName | sanitize\"></span>\n                <span ng-show=\"settings.tasksDisplayFields.skillShortName\" ng-bind-html=\"task.skillShortName | sanitize\"></span>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"column small-12 toolbar\">\n            <button ng-if=\"settings.allowCopyTask && !settings.readOnly\" class=\"button white toolbar-button\" ng-click=\"copy(task)\">\n                <span class=\"glyph-icon tollbar-icon\"><span class=\"glyph-copy4\"></span></span>\n                <span>Copy</span>\n            </button>\n            <button ng-if=\"settings.allowDeleteTask && !settings.readOnly\" class=\"button white toolbar-button\" ng-click=\"removeCard(task)\">\n                <span class=\"glyph-icon tollbar-icon\"><span class=\"glyph-remove\"></span></span>\n                <span>Delete</span>\n            </button>\n            <button ng-if=\"task.resourceId\" class=\"button white toolbar-button\" ng-click=\"openURL(task)\">\n                <span class=\"glyph-icon tollbar-icon\"><span class=\"glyph-externallink\"></span></span>\n                <span>View</span>\n            </button>\n        </div>\n    </div>\n    <div ng-show=\"settings.tasksDisplayFields.description\" class=\"row\">\n        <div class=\"column small-12\">\n            <div class=\"description\">\n                <!--<h3 class=\"legend\"><span>Description</span></h3>-->\n                <hr class=\"modal-divider\"/>\n                <p class=\"description\">{{task.description}}</p>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"column small-12\">\n            <div class=\"details\">\n                <!--<h3 class=\"legend\"><span>Details</span></h3>-->\n                <hr class=\"modal-divider\"/>\n                <div class=\"row\">\n                    <div class=\"column medium-6\">\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.ownerAppLogo\">\n                            <img class=\"owner-logo\" ng-src=\"{{task.ownerAppLogo}}\"/></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.ownerName\">\n                            <span class=\"field-label\">Owner:&nbsp;</span>\n                            <span>{{task.ownerName}}</span></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.assigneeName\">\n                            <span class=\"field-label\">Assignee:&nbsp;</span>\n                            <span>{{task.assigneeName}}</span></p>\n                        <p class=\"task-field assignees\" ng-show=\"settings.tasksDisplayFields.assignees\">\n                            <span ng-style=\"{color: task.assigneesColor}\">{{task.assignees}}</span></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.type\">\n                            <span class=\"field-label\">Task Type:&nbsp;</span>\n                            <span>{{task.type}}</span></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.state\">\n                            <span class=\"field-label\">Status:&nbsp;</span>\n                            <span>{{task.state}}</span></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.id\">\n                            <span class=\"field-label\">ID#&nbsp;</span>\n                            <span>{{task.id}}</span></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.grade\">\n                            <span class=\"field-label\">Grade&nbsp;</span>\n                            <span ng-repeat=\"grade in task.grades\">{{grade.name}}{{$last ? \'\' : \', \'}}</span></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.priority\">\n                            <priority-level value=\"task.priority._id\"></priority-level></p>\n                    </div>\n                    <div class=\"column medium-6\">\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.creationDate\">\n                            <span class=\"field-label\">Created:</span>\n                            <span>{{task.creationDate | date : \"MMM d, y \'/\' h:mm a\"}}</span></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.modifiedDate\">\n                            <span class=\"field-label\">Modified:</span>\n                            <span>{{task.modifiedDate | date : \"MMM d, y \'/\' h:mm a\"}}</span></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.assignability\">\n                            <span class=\"field-label\">Assignability:</span>\n                            <span>{{task.assignability}}</span></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.rating\">\n                            <star-rating value=\"task.rating\"></star-rating></p>\n                        <p class=\"task-field\" ng-show=\"settings.tasksDisplayFields.notes\">\n                            <span>{{task.notes}}</span></p>\n                    </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"column footer\">\n            <button class=\"button\" ng-click=\"cancel()\">Close</button>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("app/component/modals/task-group-modal/task-group-modal.html","<h2 class=\"modal-title\">Task Group Information\n    <a class=\"close-reveal-modal\" ng-click=\"modal.cancel()\">&#215;</a>\n</h2>\n<div class=\"wrapper\">\n    <div class=\"row\">\n        <div class=\"column small-12\">\n            <div class=\"header\" ng-style=\"::{color: modal.group.color}\">\n                <div class=\"group-icon\">\n                    <glyph-icon icon=\"modal.group.appRef\" class=\"card-icon\"></glyph-icon>\n                </div>\n                <span class=\"group-name\">{{::modal.group.groupName}}</span>\n            </div>\n        </div>\n    </div>\n    <div class=\"row description\" ng-hide=\"modal.settings.readOnly\">\n        <div class=\"column small-12\">\n            <button class=\"button white delete-button\" ng-click=\"modal.delete()\"><span class=\"glyph-icon tollbar-icon\"><span class=\"glyph-remove\"></span></span><span>Delete Task Group</span></button>\n        </div>\n    </div>\n    <div class=\"row details\">\n        <div class=\"column small-12\">\n            <h3 class=\"legend\"><span>Details</span></h3>\n            <br/>\n        </div>\n        <div class=\"column small-6 info\">\n            <div class=\"group-info\">\n                <div class=\"info-label-very-bold\">Master {{modal.group.masterName}}</div>\n            </div>\n            <div class=\"group-info\">\n                <div><span class=\"info-label\">Owner: </span>{{modal.group.ownerName}}</div>\n            </div>\n            <div class=\"group-info\">\n                <span class=\"info-label\">Status: </span>\n                <span class=\"status\" ng-class=\"{Completed: \'complete\'}[modal.group.state]\">{{::modal.group.state}}</span>\n            </div>\n\n        </div>\n        <div class=\"column small-6 info\">\n            <div class=\"group-info\">\n                <div><span class=\"info-label\">Created:</span> {{::modal.group.creationDate | date : \"MM-dd-yyyy h:mm a\"\n                    | lowercase}}\n                </div>\n            </div>\n            <div class=\"group-info\">\n                <div><span class=\"info-label\">Modified:</span> {{::modal.group.modifiedDate | date : \"MM-dd-yyyy h:mm a\"\n                    | lowercase}}\n                </div>\n            </div>\n\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"column footer\">\n            <button class=\"button\" ng-click=\"modal.cancel()\">Close</button>\n        </div>\n    </div>\n</div>");
$templateCache.put("app/component/task-groups/task-group/task-group.html","<div class=\"task-group\" delta-drag-handler=\"dragHandler\" ng-class=\"{\'opacity\': group.opacity, \'expanded-group\': group.$expandedGroup, \'highlighted-group\': group.$highlightedGroup}\">\n    <div class=\"task-group-content\" ng-style=\"getStyle(group, group.$highlightedGroup)\">\n        <div class=\"task-group-color\" ng-style=\"{\'background\': group.color}\"></div>\n        <div class=\"drag-button\" ng-hide=\"settings.readOnly\">\n            <span class=\"gl-drag-indicator-kanban\"></span>\n        </div>\n\n        <div class=\"after-button-area\" >\n            <div class=\"group-name\">\n                <glyph-icon icon=\"group.appRef\" class=\"card-icon\"></glyph-icon>\n                <span ng-bind-html=\"::group.groupName | sanitize\"></span>\n                <span class=\"unbold\">({{group.tasks.length}})</span>\n            </div>\n            <div class=\"info\">\n                <div class=\"group-info\">\n                    <div>Master {{group.masterName}}</div>\n                    <div>Owner: {{group.ownerName}}</div>\n                </div>\n                <div class=\"group-info secondary\">\n                    <div>Created: {{::group.creationDate | date : \"MM/dd/yy h:mm a\" | lowercase}}</div>\n                    <div>Modified: {{::group.modifiedDate | date : \"MM/dd/yy h:mm a\"  | lowercase}}</div>\n                </div>\n                <div class=\"group-info status\" ng-class=\"{Completed: \'complete\'}[group.state]\">\n                    <div>{{group.state}}</div>\n                </div>\n            </div>\n        </div>\n\n        <div ng-hide=\"settings.readOnly\" resize-button=\"resize\" class=\"resize-button\" expand-area>\n            <glyph-icon icon=\"\'glyph-arrow7\'\"></glyph-icon>\n        </div>\n\n    </div>\n</div>");
$templateCache.put("app/component/task-groups/task-group-list/task-group-list.html","<div class=\"task-group-list\">\n    <div class=\"white-line-wrapper\">\n        <div class=\"white-line\" ng-repeat=\"column in columns\" ></div>\n    </div>\n\n    <div ng-repeat=\"line in lines\" class=\"task-group-line\">\n        <task-group group=\"group\" width=\"228\" columns=\"columns\" ng-repeat=\"group in line.groups track by group.id\" settings=\"settings\"></task-group>\n    </div>\n    <div class=\"task-group-empty\" ng-hide=\"lines.length || settings.readOnly || settings.disableDefaultMessaging\">\n        <p>You haven\'t selected any {{settings.groupContentType}}</p>\n        <p><a ng-click=\"taskGroupList.addGroup()\">Go back</a><span>&nbsp;to add {{settings.groupContentType}}</span></p>\n    </div>\n</div>");
$templateCache.put("app/component/task-groups/task-groups-button/task-groups-button.html","<div class=\"text-center task-groups-button\">\n    <button ng-click=\"value = !value\">\n        <glyph-icon icon=\"value ? \'glyph-chevron-collapsed\'  : \'glyph-chevron-expanded\' \"></glyph-icon>\n        {{value ? settings.groupsCollapseButtonText : settings.groupsExpandButtonText}}\n    </button>\n</div>");}]);
angular.module('kanban-constant', [])
.constant('name', "kanban")
.constant('version', "0.0.293")
.constant('description', "rl-kanban")
.constant('scripts', {"start":"node node_modules/gulp/bin/gulp.js serve","build":"node node_modules/gulp/bin/gulp.js build"})
.constant('homepage', "http://rl-kanban.bitballoon.com/#?layout=work-tracker&contentLevel=maximum")
.constant('devDependencies', {"angular":"1.7.9","angular-resource":"1.3.2","angular-sanitize":"1.3.2","angular-animate":"1.3.2","angular-touch":"1.3.2","commander":"^2.6.0","gulp":"~3.9.0","gulp-angular-templatecache":"~1.5.0","gulp-autoprefixer":"~2.1.0","gulp-clean":"~0.3.1","gulp-clone":"~1.0.0","gulp-connect":"~2.2.0","gulp-copy":"0.0.2","gulp-css-url-adjuster":"~0.2.3","gulp-inject":"~1.0.2","gulp-jshint":"~1.9.0","gulp-jshint-xml-file-reporter":"^0.5.1","gulp-livereload":"~3.2.0","gulp-minify-css":"~0.3.11","gulp-minify-html":"~0.1.7","gulp-ng-annotate":"~0.4.3","gulp-ng-config":"~1.0.0","gulp-nightwatch":"^0.2.6","gulp-notify":"^2.2.0","gulp-open":"~0.2.8","gulp-processhtml":"^1.0.2","gulp-protractor":"^1.0.0","gulp-rename":"~1.2.0","gulp-sass":"~4.0.2","gulp-sourcemaps":"~1.2.8","gulp-uglify":"~1.0.2","gulp-usemin":"~0.3.8","gulp-util":"^3.0.4","gulp-ver":"~0.1.0","jasmine-reporters":"^2.0.7","jshint-stylish":"~1.0.0","karma":"~0.12.24","karma-chrome-launcher":"~0.1.2","karma-coverage":"~0.2.7","karma-jasmine":"~0.2.3","karma-js-coverage":"~0.2.0","karma-junit-reporter":"^0.3.8","karma-ng-html2js-preprocessor":"~0.1.0","karma-ng-json2js-preprocessor":"^1.1.1","karma-phantomjs-launcher":"~0.1.2","phantomjs":"~1.9.15","protractor":"^3.0.0","run-sequence":"~1.0.2","underscore":"1.7.0"})
.constant('kanbanVersion', "0.0.293");
