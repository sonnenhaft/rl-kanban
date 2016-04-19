describe.module('component.swim-lane', function () {
    var directive, scope;
    beforeEach(inject(function (directiveBuilder) {
        directive = directiveBuilder.$build('<swim-lane swimlane="swimlane" settings="settings" groups="groups"></swim-lane>', {
            swimlane: {columns: {}, id: 'test'},
            settings: {},
            groups: [{}]
        });
    }));

    it('should be defined', function () {
        expect(directive.element).toBeDefined();
        scope = directive.element.isolateScope();
    });

    it('should toggle expand/collapse', function () {
        expect(scope.swimlane.collapsed).toBe(false);
        scope.toggleCollapse();
        scope.$digest();
        expect(scope.swimlane.collapsed).toBe(true);
    });

    it('should toggle swimlane edit', function () {
        var event = {
            stopPropagation: jasmine.createSpy('stopPropagation')
        };
        var swimlane = {
            cancelEdit: jasmine.createSpy('cancelEdit'),
            edit: jasmine.createSpy('edit'),
            $edit: true
        };
        scope.toggleEdit(event, swimlane);
        expect(swimlane.cancelEdit).toHaveBeenCalled();
        swimlane.$edit = false;
        scope.toggleEdit(event, swimlane);
        expect(swimlane.edit).toHaveBeenCalled();
    });

    it('should fire add resources event', function () {
        var event = {
            stopPropagation: jasmine.createSpy('stopPropagation')
        };
        spyOn(scope, '$emit');
        scope.addResource(event);
        expect(scope.$emit).toHaveBeenCalledWith('kanban:add-task', 'test');
        scope.groups = [];
        scope.addResource(event);
    });

    it('should stop click event propagation from children', function () {
        var event = {
            stopPropagation: jasmine.createSpy('stopPropagation'),
            type: 'click',
            target: {
                parentNode: directive.element.children()[0]
            }
        };
        directive.element.triggerHandler(event);
        expect(event.stopPropagation).toHaveBeenCalled();
        event = {
            stopPropagation: jasmine.createSpy('stopPropagation'),
            type: 'click',
            target: {
                parentNode: directive.element
            }
        };
        directive.element.triggerHandler(event);
        expect(event.stopPropagation).not.toHaveBeenCalled();
    });
});
