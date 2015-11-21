describe.module('component.expand-collapse', function () {
    beforeEach(module('ngAnimateMock'));

    describe('test-group-1', function () {
        var parentScope, element, scope, $animate;
        beforeEach(inject(function (directiveBuilder, _$animate_) {
            $animate = _$animate_;
            var directive = directiveBuilder.$build('<div expand-collapse="expand"></div>');
            element = directive.element;
            scope = element.scope();
            parentScope = directive.scope;
            spyOn($animate, 'addClass').and.callThrough();
            spyOn($animate, 'removeClass').and.callThrough();
        }));

        it('should be defined', function () {
            expect(element).toBeDefined();
        });

        it('should collapse', function () {
            parentScope.expand = true;
            scope.$apply();
            expect(element.hasClass('kanban-collapsing')).toBe(true);
            $animate.triggerCallbackPromise();
            expect(element.hasClass('kanban-collapsing')).toBe(false);
            expect(element.hasClass('kanban-in')).toBe(true);
            expect($animate.addClass).toHaveBeenCalled();
            parentScope.expand = false;
            scope.$apply();
            expect(element.hasClass('kanban-collapsing')).toBe(true);
            $animate.triggerCallbackPromise();
            expect(element.hasClass('kanban-collapsing')).toBe(false);
            expect($animate.removeClass).toHaveBeenCalled();
            expect(element.hasClass('kanban-in')).toBe(false);
        });
    });

    describe('test-group-2', function () {
        var directive;
        beforeEach(inject(function (directiveBuilder) {
            directive = directiveBuilder.$build('<div expand-collapse="expand" expand-disabled="disabled"></div>', {disabled: true});
        }));

        it('should collapse', inject(function ($animate) {
            directive.scope.expand = true;
            directive.scope.$apply();
            $animate.triggerCallbackPromise();
            expect(directive.element.hasClass('kanban-in')).toBe(false);
        }));
    });
});
