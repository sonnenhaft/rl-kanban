describe('kanban', function () {
    beforeEach(module('kanban'));
    beforeEach(module('component.kanban-model'));

    var directive, element, scope, controller, $document;
    beforeEach(inject(function (directiveBuilder, testConfig, generateKanbanModel, _$document_) {
        $document = _$document_;
        var config = generateKanbanModel(testConfig);
        directive = directiveBuilder.build('<kanban config="config"></kanban>', {config: config});
        directive.scope.$digest();
        element = directive.element;
        controller = element.controller('kanban');
        scope = element.isolateScope();
    }));

    it('should be defined', function () {
        expect(element).toBeDefined();
        expect(controller).toBeDefined();
    });

    it('should collapse columns',function(){
        var column = scope.config.swimlanes[0].columns[0];
        spyOn(column, 'collapse');
        controller.toggleColumn(column.id);
        expect(column.collapse).toHaveBeenCalled();
        controller.toggleColumn(column.id);
    });

    it('should cancel swimlane editing', function(){
        var swimlane = scope.config.swimlanes[0];
        swimlane.$edit = true;
        controller.checkEditableSwimlanes();
        expect(swimlane.$edit).toBe(false);
    });

    it('should clear invalid warning', function(){
        var column = scope.config.swimlanes[0].columns[0];
        column.$barred = true;
        controller.clearInvalidStates();
        expect(column.$barred).toBe(false);
    });

    it('should highlight task', function(){
        var task = scope.config.tasks[1];
        controller.highlightTask(task);
        expect(task.$highlight).toBe(true);
    });

    it('should get highlighted tasks', function(){
        var task = scope.config.tasks[1];
        controller.highlightTask(task);
        expect(controller.getHighlighted().length).toBe(1);
    });

    it('should validate selected task state', function(){
        var task = scope.config.tasks[3];
        var column = scope.config.swimlanes[0].columns[0];
        controller.highlightTask(task);
        controller.validateStates();
        expect(column.$barred).toBe(true);
    });

    it('should validate selected task state', function(){
        var task = scope.config.tasks[3];
        var column = scope.config.swimlanes[0].columns[0];
        controller.validateColumns(task);
        expect(column.$barred).toBe(true);
    });

    it('should register esc handler', function(){
        angular.element(document.body).triggerHandler({type: 'keyup', which: 27});
        scope.$destroy();
    });
});