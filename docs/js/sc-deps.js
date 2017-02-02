/**
 * @ngdoc directive
 * @name component.directive:tool-tip
 * @restrict EA
 * @param {string} type type tooltip short or long.
 * @param {string} event type to show tooltip, click or hover.
 * @param {boolean} appendToBody append tooltip in body element or next to element.
 * @param {string} text body for tooltip.
 * @description
 * Tooltip for full information
 */

//@deprecated - spaghetti code
/*jshint maxstatements: 25 */
angular.module('component.tool-tip', [
    'mm.foundation.position'
]).directive('toolTip', ["$http", "$window", "$document", "$timeout", "$compile", "$position", "$templateCache", function ($http, $window, $document, $timeout, $compile, $position, $templateCache) {
    var paddingForSideWindow = 12;
    var paddingForSideElement = 20;

    function createTemplate(templateContent) {
        return '' +
            '<div class="tooltip-popup {{::type || \'short\'}}-tip" ng-class="tipClass" ng-click="$event.stopPropagation()">' +
            (templateContent || '<div>{{::text}}</div><div ng-bind-html="html"></div>') +
            '<button ng-click="close()" class="close-button">' +
            '<span class="glyph-icon"><span class="glyph-close"></span></span>' +
            '</button> ' +
            '<span class="nub"></span> ' +
            '</div>';
    }

    function createTooltip($scope) {
        var template = createTemplate($scope.templateUrl ? $templateCache.get($scope.templateUrl) : null);
        for (var key in $scope.scopeItems || {}) {
            if (!$scope.scopeItems.hasOwnProperty(key)) {
                continue;
            }
            $scope[key] = $scope.scopeItems[key];
        }
        var tooltip = $compile(template)($scope);
        $scope.$digest();
        return tooltip;
    }

    function addTooltipToElement($element, tooltip, isAppendToBody) {
        tooltip.css({top: 0, left: 10000, display: 'block', position: 'fixed', width: 'auto'});
        if (isAppendToBody) {
            $document.find('body').append(tooltip);
        } else {
            $element.after(tooltip);
        }
        return tooltip;
    }

    function removeTooltipIfExist() {
        var result = angular.element($document[0].getElementsByClassName('tooltip-popup'));
        if (result.length && result.scope()) {
            result.scope().close();
        }
    }

    function calculateTooltipWidth(tooltip) {
        var documentWidth = angular.element($document.prop('body')).prop('clientWidth');
        var tooltipWidth = tooltip.prop('offsetWidth');
        if (tooltipWidth + paddingForSideWindow * 2 > documentWidth) {
            tooltipWidth = documentWidth - paddingForSideWindow * 2;
        }
        return tooltipWidth + 1;
    }

    function positionTooltipForElementPosition(tooltip, elementPosition) {
        var tooltipWidth = tooltip.prop('offsetWidth');
        var tooltipHeight = tooltip.prop('offsetHeight');
        return {
            top: elementPosition.top - tooltipHeight - paddingForSideElement + 'px',
            left: elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2 + 'px'
        };
    }

    function changeDirectionTooltipForWindowSize(tooltip, elementPosition) {
        var documentWidth = $document[0].body.clientWidth;
        var tooltipPosition = $position.offset(tooltip);
        var tooltipBoundingRectangle = tooltip[0].getBoundingClientRect();

        if (tooltipPosition.left < paddingForSideWindow) {
            tooltip.css({left: paddingForSideWindow + 'px'});
        } else if (tooltipPosition.left + tooltipPosition.width + paddingForSideWindow * 2 > documentWidth) {
            tooltip.css({left: 'auto', right: paddingForSideWindow + 'px'});
        }

        if (tooltipBoundingRectangle.top < paddingForSideWindow) {
            tooltip
                .css({top: elementPosition.top + elementPosition.height + paddingForSideElement + 'px'})
                .addClass('bottom-tooltip');
        } else {
            tooltip.removeClass('bottom-tooltip');
        }
    }

    function changePositionTooltipNubForElementPosition(tooltip, elementPosition) {
        var nubElement = angular.element(tooltip[0].getElementsByClassName('nub'));
        var tooltipPosition = $position.offset(tooltip);
        nubElement.css({left: elementPosition.left - tooltipPosition.left + elementPosition.width / 2 + 'px'});
    }

    return {
        template: '<span class="show-tooltip" ng-transclude></span>',
        transclude: true,
        scope: {
            type: '@',
            event: '@',
            appendToBody: '=',
            text: '=',
            html: '=',
            scopeItems: '=scope',
            templateUrl: '@',
            tipClass: '@',
            positionOn: '@',
            transitionDuration: '@'
        },

        link: function ($scope, $element) {
            if ($scope.templateUrl && !$templateCache.get($scope.templateUrl)) {
                $http.get($scope.templateUrl).then(function (data) {
                    $templateCache.put($scope.templateUrl, data.data);
                });
            }

            var tooltip, startOffset;
            var events = {
                click: 'click',
                touch: 'touchstart'
            };

            var eventType = $scope.event || 'hover';
            var typeTooltip = $scope.type || 'short';

            var currentEvent;
            if ($window.hasOwnProperty('ontouchstart')) {
                currentEvent = events.touch;
            } else {
                currentEvent = events[eventType] || events.click;
            }

            $scope.close = function () {
                removeCurrentTooltip();
            };

            $scope.$on('$destroy', function () {
                removeCurrentTooltip();
                unbindEvents();
            });

            function isAppendToBody() {
                return angular.isDefined($scope.appendToBody) ? $scope.appendToBody : true;
            }

            function bindEvents() {
                $element.on(currentEvent, showTooltip);
                if (eventType === 'hover') {
                    $element.on('mouseenter', showTooltip);
                    typeTooltip === 'short' && $element.on('mouseleave', removeCurrentTooltip);
                }
            }

            bindEvents();

            function unbindEvents() {
                $element.off(currentEvent, showTooltip);
                $element.off('mouseenter', showTooltip);
                $element.off('mouseleave', removeCurrentTooltip);
            }

            function cancelTouchOnTooltip(event) {
                event.preventDefault();
                event.stopPropagation();
            }

            function bindDestroyTooltipEvents() {
                $document.on('click', removeCurrentTooltip);
                $document.on('touchend', removeCurrentTooltip);
                tooltip.on('touchend', cancelTouchOnTooltip);
                angular.element($window).bind('resize', removeCurrentTooltip);
            }

            function showTooltip(event) {
                event.preventDefault();
                event.stopPropagation();
                if (tooltip) {
                    removeCurrentTooltip();
                } else {
                    removeTooltipIfExist();
                    var elementPosition = isAppendToBody() ? $position.offset($element) : $position.position($element);
                    tooltip = createTooltip($scope);
                    tooltip = addTooltipToElement($element, tooltip, isAppendToBody());
                    tooltip.css({width: calculateTooltipWidth(tooltip) + 'px'});
                    tooltip.css({position: 'absolute'}).css(positionTooltipForElementPosition(tooltip, elementPosition));
                    if (isAppendToBody()) {
                        changeDirectionTooltipForWindowSize(tooltip, elementPosition);
                        changePositionTooltipNubForElementPosition(tooltip, elementPosition);
                        startOffset = elementPosition;
                    }
                    bindDestroyTooltipEvents();
                    eventType === 'hover' && $element.off('mouseenter', showTooltip);
                }
            }

            function removeCurrentTooltip() {
                $document.off('click touchend', removeCurrentTooltip);
                angular.element($window).unbind('resize', removeCurrentTooltip);
                if (tooltip) {
                    startOffset = null;
                    tooltip.off('touchend', cancelTouchOnTooltip);
                    eventType === 'hover' && $element.on('mouseenter', showTooltip);
                    var transitionDuration = $scope.transitionDuration || 0.3;
                    var transition = 'all linear ' + transitionDuration.toString() + 's';
                    tooltip.css({
                        '-webkit-transition': transition,
                        '-moz-transition': transition,
                        '-o-transition': transition,
                        'transition': transition,
                        opacity: '0'
                    });
                    $timeout(function () {
                        if (tooltip) {
                            tooltip.remove();
                            tooltip = null;
                        }
                    }, transitionDuration * 1000);
                }
            }

            $scope.$on($scope.positionOn || 'tool-tip:position', function (e, parentPosition) {
                if (tooltip && isAppendToBody()) {
                    var elementPosition = $position.offset($element);
                    var elementTopOffset = startOffset ? Math.abs(startOffset.top - elementPosition.top) : 0;
                    if (elementTopOffset < 80 &&
                        parentPosition &&
                        parentPosition.top < elementPosition.top &&
                        parentPosition.top + parentPosition.height > elementPosition.top) {

                        tooltip.css({position: 'absolute'}).css(positionTooltipForElementPosition(tooltip, elementPosition));
                        changeDirectionTooltipForWindowSize(tooltip, elementPosition);
                    } else {
                        $scope.close();
                    }
                }
            });
        }
    };
}]);