describe('glyph-icon', function () {
    beforeEach(module('templates'));
    beforeEach(module('component.glyph-icon'));

    var directive;
    beforeEach(inject(function (directiveBuilder) {
        directive = directiveBuilder.build('<glyph-icon icon="icon"></glyph-icon>');
    }));

    it('should display something when visible', function () {
        directive.scope.icon = 'icon';
        directive.scope.$digest();
        expect(directive.element.find('span').length).toBeGreaterThan(0);
    });

    it('should display something when visible', function () {
        directive.scope.$digest();
        expect(directive.element.find('span').length).toBe(0);
    });
});
