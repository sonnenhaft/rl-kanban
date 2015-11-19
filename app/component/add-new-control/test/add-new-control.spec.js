describe('component.column-names', function () {
    beforeEach(module('templates'));
    beforeEach(module('component.add-new-control'));

    var directive, element, scope;
    beforeEach(inject(function (directiveBuilder) {
        directive = directiveBuilder.build('<add-new-control></add-new-control>');
        directive.scope.$digest();
        element = directive.element;
        scope = element.scope();
        spyOn(scope, '$emit');
    }));

    it('should be defined', function () {
        expect(element).toBeDefined();
    });

    it('should emit event to add task', function () {
        scope.addTask();
        expect(scope.$emit).toHaveBeenCalledWith('addTask');
    });

    it('should emit event to add group', function () {
        scope.addGroup();
        expect(scope.$emit).toHaveBeenCalledWith('addGroup');
    });
});