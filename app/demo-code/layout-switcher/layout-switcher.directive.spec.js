describe.module('demo-code.layout-switcher', function () {
    var directive;
    //TODO: split this test stub into multiply tests
    beforeEach(inject(function (directiveBuilder, $httpBackend, $location) {
        $httpBackend.whenGET(/work-tracker.json/).respond({settings: {}});
        $location.search({empty: true});
        directive = directiveBuilder.$build('<layout-switcher ng-controller="LayoutSwitcherDemoController"></layout-switcher>', {
            kanbanModel: {tasks: [{}]}
        });
        $httpBackend.flush();
        directive.scope.$broadcast('kanban:task:moved');
        directive.scope.$broadcast('kanban:task:modalopen');
    }));

    it('should be defined', function () {
        expect(directive.element).toBeDefined();
    });
});