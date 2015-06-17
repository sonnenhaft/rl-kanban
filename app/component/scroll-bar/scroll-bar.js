angular.module('component.scroll-bar', [])
    .directive('scrollbar', function () {
        return {
            restrict: 'E',
            template: '<div class="inner" columns-width></div>'
        };
    })
    .directive('combineHorizontalScrolls', function () {
        return {
            restrict: 'A',
            controller: function () {
                var targetNodes = [];

                this.registerScrollElemnt = function (element) {
                    targetNodes.push(element[0]);
                    element.on('scroll', combineHorizontalScrolls);
                };

                this.removeScrollElemnt = function (element) {
                    targetNodes.splice(targetNodes.indexOf(element[0]), 1);
                    element.off('scroll', combineHorizontalScrolls);
                };

                function combineHorizontalScrolls(event) {
                    angular.forEach(targetNodes, function (targetNode) {
                        targetNode.scrollLeft = event.target.scrollLeft;
                    });
                }
            }
        };
    })
    .directive('horizontalScroll', function () {
        return {
            restrict: 'A',
            require: '^combineHorizontalScrolls',
            link: function (scope, element, attrs, ctrl) {
                ctrl.registerScrollElemnt(element);

                scope.$on('$destroy', function () {
                    ctrl.removeScrollElemnt(element);
                });
            }
        };
    })
    .directive('columnsWidth', function () {
        return {
            restrict: 'A',
            require: '^kanban',
            link: function (scope, element, attrs, kanban) {
                kanban.registerElement(element);

                scope.$on('$destroy', function () {
                    kanban.removeElement(element);
                });
            }
        };
    });