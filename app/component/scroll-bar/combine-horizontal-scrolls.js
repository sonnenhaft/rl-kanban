angular.module('component.scroll-bar').directive('combineHorizontalScrolls', function () {
    return {
        restrict: 'A',
        controller: function () {
            var targetNodes = [];

            this.registerScrollElement = function ($element) {
                targetNodes.push($element[0]);
                $element.on('scroll', combineHorizontalScrolls);
            };

            this.removeScrollElement = function ($element) {
                targetNodes.splice(targetNodes.indexOf($element[0]), 1);
                $element.off('scroll', combineHorizontalScrolls);
            };

            function combineHorizontalScrolls(event) {
                targetNodes.forEach(function (targetNode) {
                    if (targetNode.scrollLeft !== event.target.scrollLeft) {
                        targetNode.scrollLeft = event.target.scrollLeft;
                    }
                });
            }
        }
    };
});