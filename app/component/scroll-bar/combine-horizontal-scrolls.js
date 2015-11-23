angular.module('component.scroll-bar').directive('combineHorizontalScrolls', function () {
    return {
        restrict: 'A',
        controller: function () {
            var targetNodes = [];
            this.scrollBarElement = null;

            this.registerScrollElement = function ($element) {
                targetNodes.push($element[0]);
                $element.on('scroll', synchronizeHorizonalScroll);
            };

            this.removeScrollElement = function ($element) {
                targetNodes.splice(targetNodes.indexOf($element[0]), 1);
                $element.off('scroll', synchronizeHorizonalScroll);
            };

            var synchronizeHorizonalScroll = angular.bind(this, function (scrollEvent) {
                var scrollLeft = scrollEvent.target.scrollLeft;
                var max = this.scrollBarElement.scrollWidth - this.scrollBarElement.clientWidth;

                targetNodes.forEach(function (targetNode) {
                    if (targetNode.scrollLeft !== scrollLeft) {
                        targetNode.scrollLeft = scrollLeft > max ? max : scrollLeft;
                    }
                });
            });
        }
    };
}).directive('columnsWidth', function () {
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