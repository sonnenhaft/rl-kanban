angular.module('component.scroll-bar').directive('combineHorizontalScrolls', function () {
    return {
        restrict: 'A',
        controller: function () {
            var targetNodes = [];

            this.registerScrollElement = function ($element) {
                targetNodes.push($element[0]);
                $element.on('scroll', synchronizeHorizonalScroll);
            };

            this.removeScrollElement = function ($element) {
                targetNodes.splice(targetNodes.indexOf($element[0]), 1);
                $element.off('scroll', synchronizeHorizonalScroll);
            };

            function synchronizeHorizonalScroll(scrollEvent) {
                targetNodes.forEach(function (targetNode) {
                    if (targetNode.scrollLeft !== scrollEvent.target.scrollLeft) {
                        targetNode.scrollLeft = scrollEvent.target.scrollLeft;
                    }
                });
            }
        }
    };
});