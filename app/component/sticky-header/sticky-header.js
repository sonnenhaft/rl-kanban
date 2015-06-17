angular.module('component.stickyHeader', []).directive('stickyHeader', function ($window, $document, $timeout) {
    return {
        link: function (scope, element, attrs) {
            var isStuck = false;
            var start = element[0].getBoundingClientRect().top + $document[0].body.scrollTop;
            var style = getComputedStyle(element[0]);
            var wrapper = element.wrap('<div></div>').parent();

            function scrollSpy() {
                var pos = $document[0].body.scrollTop;

                if (!isStuck && pos > start) {
                    wrapper.css({height: element[0].offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom) + 'px'});

                    element.css({
                        width: element[0].offsetWidth + 'px',
                        position: 'fixed',
                        top: 0
                    });

                    isStuck = true;
                }
                else if (isStuck && pos < start) {
                    wrapper.css({height: ''});

                    element.css({
                        width: '',
                        position: '',
                        top: ''
                    });

                    isStuck = false;
                }
            }

            function recheckPositions() {
                if (!isStuck) {
                    start = element[0].getBoundingClientRect().top + $document[0].body.scrollTop;
                }
            }

            angular.element(document).ready(recheckPositions);
            angular.element($window).on('scroll', scrollSpy);
            angular.element($window).on('resize', recheckPositions);

            scope.$on('$destroy', function () {
                angular.element($window).off('resize', recheckPositions);
                angular.element($window).on('scroll', scrollSpy);
                wrapper.remove();
            });

        }
    };
});