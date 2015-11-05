angular.module('component.stickyHeader', []).directive('stickyHeader', function ($window) {
    var $root = angular.element($window);
    return {
        link: function ($scope, $element) {
            var iElement = $element[0];
            var isStuck = false;
            var start = iElement.getBoundingClientRect().top + $window.document.body.scrollTop;
            var style = $window.getComputedStyle(iElement);
            var wrapper = $element.wrap('<div></div>').parent();

            function scrollSpy() {
                var pos = $window.document.body.scrollTop || $window.document.documentElement.scrollTop;
                if (!isStuck && pos > start) {
                    wrapper.css({height: iElement.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom) + 'px'});

                    $element.css({width: iElement.offsetWidth + 'px', position: 'fixed',top: 0});

                    isStuck = true;
                } else if (isStuck && pos <= start) {
                    wrapper.css({height: ''});

                    $element.css({width: '',position: '',top: ''});

                    isStuck = false;
                }
            }

            function recheckPositions() {
                if (!isStuck) {
                    start =iElement.getBoundingClientRect().top + $window.document.body.scrollTop;
                }
            }

            angular.element($window.document).ready(recheckPositions);
            $root.on('scroll', scrollSpy);
            $root.on('resize', recheckPositions);

            $scope.$on('$destroy', function () {
                $root.off('resize', recheckPositions);
                $root.on('scroll', scrollSpy);
                wrapper.remove();
            });
        }
    };
});