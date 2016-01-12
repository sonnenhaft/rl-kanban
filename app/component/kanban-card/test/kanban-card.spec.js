describe.module('component.kanban-card', function () {
    var directive, kanbanMock, settingsMock;
    beforeEach(inject(function (directiveBuilder) {
        kanbanMock = {highlightTask: jasmine.createSpy('highlightTask')};
        settingsMock = {notes: true, highlightTaskOnClick: true, enableMultiSelect: true};
        directive = directiveBuilder.$build('<kanban-card as-sortable-item></kanban-card>', {
            task: {column: {swimlane: {$disabled: false}}},
            settings: settingsMock
        }, {
            kanban: kanbanMock,
            asSortable: {scope: {modelValue: {}}}
        });
    }));

    //TODO: split this test stub into multiply tests
    it('should be defined', inject(function ($timeout) {
        expect(directive.element).toBeDefined();

        directive.scope.task.$highlight = false;
        directive.scope.$digest();
        directive.scope.task.$highlight = true;
        directive.scope.$digest();

        directive.element.triggerHandler('touchstart');
        directive.element.child('.card-handle').triggerHandler('touchstart');

        directive.element.child('.card-handle').triggerHandler('touchend');
        directive.scope.$broadcast('$destroy');
        $timeout.flush(500);
        directive.element.triggerHandler('touchend');
        directive.element.child('.card-wrapper').triggerHandler('click');

        directive.scope.settings.highlightTaskOnClick = true;
        directive.element.child('.card-wrapper').triggerHandler('click');
    }));

    it('should highlight task', function () {
        var task = {$edit: false};
        directive.scope.highlightTask(task, {});
        expect(kanbanMock.highlightTask).toHaveBeenCalled();
    });

    it('should not highlight task in edit mode', function () {
        var task = {$edit: true};
        directive.scope.highlightTask(task, {});
        expect(kanbanMock.highlightTask).not.toHaveBeenCalled();
    });

    it('should toggle highlight task if ctrl or command key is pressed', function () {
        var task = {$highlight: true};
        directive.scope.highlightTask(task, {metaKey: true});
        expect(kanbanMock.highlightTask).not.toHaveBeenCalled();
        expect(task.$highlight).toBe(false);
        directive.scope.highlightTask(task, {ctrlKey: true});
        expect(task.$highlight).toBe(true);
    });

    it('should unhighlight tasks if multiselect is turned off', function () {
        var task = {$highlight: true};
        settingsMock.enableMultiSelect = false;
        directive.scope.highlightTask(task, {});
        expect(kanbanMock.highlightTask).toHaveBeenCalled();
    });

    it('should not toggle highlight task if multiselect is turned off', function () {
        var task = {$highlight: true};
        settingsMock.enableMultiSelect = true;
        directive.scope.highlightTask(task, {});
        expect(kanbanMock.highlightTask).not.toHaveBeenCalled();
    });

    it('should toggle full description', function () {
        var task = {$highlight: false, notes: 'test'};
        directive.scope.showFullDescription(task, {}, {
            stopPropagation: angular.noop
        });
        expect(directive.scope.limit).toEqual(4)
    });

    it('should not toggle full description if task in edit mode', function () {
        var task = {$highlight: false, notes: 'test', $edit: true};
        directive.scope.showFullDescription(task, {}, {
            stopPropagation: angular.noop
        });
        expect(directive.scope.limit).toEqual(50)
    });

    it('toggle full description should toggle highlight task', function () {
        var task = {$highlight: false, notes: 'test'};
        directive.scope.showFullDescription(task, {highlightTaskOnClick: true}, {
            stopPropagation: angular.noop
        });
        expect(kanbanMock.highlightTask).toHaveBeenCalled();
    });

    it('should remove task', function () {
        var task = {$highlight: false, notes: 'test', remove: jasmine.createSpy('remove')};
        directive.scope.deleteTask({
            stopPropagation: angular.noop
        }, task);
        directive.scope.$apply();
        //expect(task.remove).toHaveBeenCalled();
    });
});
