angular.module('component.stickyHeader', [
]).directive('stickyHeader', function ($window) {

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
});