describe.module('component.kanban-board', function () {
    var directive;
    beforeEach(inject(function (directiveBuilder) {
        directive = directiveBuilder.$build('<kanban-board swimlane="swimlane" settings="settings"></kanban-board>', {
            swimlane: {columns: {}},
            settings: {}
        }, {
            kanban: {},
            horizontalScroll: {
                $element: angular.element('<div>')
            }
        });
    }));

    //TODO: split this test stub into multiply tests
    it('should be defined', function () {
        expect(directive.element).toBeDefined();
        var scope = directive.element.isolateScope().scrollCallbacks;
        scope.dragStart({source: {itemScope: {task: {}}}});
        scope.itemMoved({
            source: {itemScope: {task: {moveToColumn: angular.noop}}},
            dest: {sortableScope: {$parent: {column: {swimlane: {}}}}}
        });
    });
});
