describe.module('demo-code.kanban-version', function () {
    var element, scope;
    //TODO: split this test stub into multiply tests
    beforeEach(inject(function (directiveBuilder, $httpBackend) {
        $httpBackend.whenGET('package.json').respond({version: 4});
        var directive = directiveBuilder.$build('<kanban-version-tag></kanban-version-tag>');
        $httpBackend.flush();
        element = directive.element;
        scope = element.scope();
    }));

    it('should be defined', function () {
        expect(element).toBeDefined();
    });
});