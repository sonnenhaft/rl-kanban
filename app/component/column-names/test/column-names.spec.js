describe.module('component.column-names', function () {
    beforeEach(module('kanban'));
    beforeEach(module('component.kanban-model'));

    var  element, scope, kanbanController;
    beforeEach(inject(function (directiveBuilder, testConfig, generateKanbanModel) {
        var config = generateKanbanModel(testConfig);
        var directive = directiveBuilder.$build('<kanban config="config"><column-names columns="columns" settings="settings">' +
            '</column-names><kanban>', {config: config});
        element = directive.element.find('column-names');
        kanbanController = directive.element.controller('kanban');
        scope = element.isolateScope();
        spyOn(kanbanController, 'toggleColumn');
        spyOn(scope, '$emit');
    }));

    it('should be defined', function () {
        expect(element).toBeDefined();
    });

    it('should toggle columns', function () {
        var column = scope.columns[0];
        scope.toggleColumn(column);
        expect(kanbanController.toggleColumn).toHaveBeenCalled();
        expect(scope.$emit).toHaveBeenCalled();
        expect(column.$collapsed).toBe(true);
        scope.settings.showHideColumns = false;
        scope.toggleColumn(column);
        expect(column.$collapsed).toBe(true);
        scope.settings.showHideColumns = true;
        scope.toggleColumn(column);
        expect(column.$collapsed).toBe(false);
    });
});