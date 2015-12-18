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
                    } else if (targetNode.scrollLeft === scrollLeft && targetNode === scrollEvent.target) {
                        targetNode.scrollLeft = scrollLeft > max ? max : scrollLeft;
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