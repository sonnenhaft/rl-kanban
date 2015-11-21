describe.module('component.expand-collapse', function () {
    beforeEach(module('ngAnimateMock'));

    describe('test-group-1', function () {
        var directive, element, scope, $animate;
        beforeEach(inject(function (directiveBuilder, _$animate_) {
            $animate = _$animate_;
            directive = directiveBuilder.build('<div expand-collapse="expand"></div>');
            directive.scope.$digest();
            element = directive.element;
            scope = element.scope();
            spyOn($animate, 'addClass').and.callThrough();
            spyOn($animate, 'removeClass').and.callThrough();
        }));

        it('should be defined', function () {
            expect(element).toBeDefined();
        });

        it('should collapse', function () {
            directive.scope.expand = true;
            scope.$apply();
            expect(element.hasClass('kanban-collapsing')).toBe(true);
            $animate.triggerCallbackPromise();
            expect(element.hasClass('kanban-collapsing')).toBe(false);
            expect(element.hasClass('kanban-in')).toBe(true);
            expect($animate.addClass).toHaveBeenCalled();
            directive.scope.expand = false;
            scope.$apply();
            expect(element.hasClass('kanban-collapsing')).toBe(true);
            $animate.triggerCallbackPromise();
            expect(element.hasClass('kanban-collapsing')).toBe(false);
            expect($animate.removeClass).toHaveBeenCalled();
            expect(element.hasClass('kanban-in')).toBe(false);
        });
    });

    describe('test-group-2', function () {
        var directive, element, $animate;
        beforeEach(inject(function (directiveBuilder, _$animate_) {
            $animate = _$animate_;
            directive = directiveBuilder.build('<div expand-collapse="expand" expand-disabled="disabled"></div>', {disabled: true});
            directive.scope.$digest();
            element = directive.element;
        }));

        it('should collapse', function () {
            directive.scope.expand = true;
            directive.scope.$apply();
            $animate.triggerCallbackPromise();
            expect(element.hasClass('kanban-in')).toBe(false);
        });
    });
});