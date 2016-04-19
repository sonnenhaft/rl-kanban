/**
 * @ngdoc directive
 * @name component.directive:glyph-icon
 * @restrict E
 * @param {string} icon of the class of one of the icons from Glyph Icons font.
 * @description
 * Displays icon from RlGlyph icons collection.
 */
angular.module('component.glyph-icon', [
]).directive('glyphIcon', function () {
    return {
        templateUrl: 'app/component/glyph-icon/glyph-icon.html',
        scope: {
            icon: '='
        }
    };
});
