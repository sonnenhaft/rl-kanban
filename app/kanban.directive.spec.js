describe.module('kanban', function () {
    var element, scope, controller;
    beforeEach(inject(function (directiveBuilder, testConfig, generateKanbanModel) {
        var config = generateKanbanModel(testConfig);
        var directive = directiveBuilder.$build('<kanban config="config"></kanban>', {config: config});
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
        scope.config.settings.enableMultiSelect = false;
        expect(controller.getHighlighted().length).toBe(1);
    });

    it('should validate selected task state', function(){
        var task = scope.config.tasks[3];
        var column = scope.config.swimlanes[0].columns[0];
        controller.highlightTask(task);
        controller.validateStates();
        expect(column.$barred).toBe(true);
        scope.config.settings.highlightTaskOnClick = false;
        controller.validateStates(task);
    });

    it('should validate selected task state [TODO:Stan, update description]', function(){
        var task = scope.config.tasks[3];
        var column = scope.config.swimlanes[0].columns[0];
        controller.validateColumns(task);
        expect(column.$barred).toBe(true);
        task = scope.config.tasks[2];
        task.validStates = null;
        column = scope.config.swimlanes[0].columns[1];
        controller.validateColumns(task);
        expect(column.$barred).not.toBeDefined();
    });

    it('should not deselect tasks on esc keypress or click if modal is open', inject(function($document){
        var $body = $document.find('body').eq(0);
        $body.addClass('modal-open');
        scope.config.tasks[3].$highlight = true;
        $body.triggerHandler({type: 'keyup', which: 27});
        scope.$destroy();
        var highlightedTask = scope.config.tasks.filter(function (task) {
            return task.$highlight;
        });
        expect(highlightedTask.length).toBe(1);
    }));

    it('should deselect tasks on esc keypress or click', inject(function($document){
        var $body = $document.find('body').eq(0);
        $body.removeClass('modal-open');
        scope.config.tasks[3].$highlight = true;
        $body.triggerHandler({type: 'keyup', which: 27});
        scope.$destroy();
        var highlightedTask = scope.config.tasks.filter(function (task) {
            return task.$highlight;
        });
        expect(highlightedTask.length).toBe(0);
    }));
});