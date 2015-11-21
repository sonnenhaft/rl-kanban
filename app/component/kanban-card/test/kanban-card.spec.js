describe.module('component.kanban-card', function () {
    var directive;
    beforeEach(inject(function (directiveBuilder) {
        directive = directiveBuilder.build('<kanban-card as-sortable-item></kanban-card>', {
            task: {column: {swimlane: {$disabled: false}}},
            settings: {notes: true, highlightTaskOnClick: false}
        }, {
            kanban: {highlightTask: angular.noop},
            asSortable: {scope: {modelValue: {}}}
        });
        directive.scope.$digest();
    }));

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
});
