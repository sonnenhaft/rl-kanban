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

            var synchronizeHorizonalScroll = (function (scrollEvent) {
                var scrollLeft = scrollEvent.target.scrollLeft;
                var max = this.scrollBarElement.scrollWidth - this.scrollBarElement.clientWidth;

                targetNodes.forEach(function (targetNode) {
                    targetNode.scrollLeft = scrollLeft > max ? max : scrollLeft;
                });
            }).bind(this);
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