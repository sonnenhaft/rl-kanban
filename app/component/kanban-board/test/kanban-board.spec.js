describe.module('component.kanban-board', function () {
    var element, scope, sourceScopeMock, destScopeMock;
    var taskMock = {
        group: {},
        validStates: [],
        column: {
            tasks: []
        },
        moveToColumn: jasmine.createSpy('moveToColumn')
    };

    beforeEach(inject(function ($rootScope, $compile) {
        element = angular.element('<kanban-board swimlane="swimlane" settings="settings"></kanban-board>');

        var kanbanWrapper = element.wrap('<div></div>').parent();
        var parentScope = $rootScope.$new();

        var kanbanController = {
            highlightTask: jasmine.createSpy('highlightTask'),
            validateStates: jasmine.createSpy('validateStates'),
            checkEditableSwimlanes: jasmine.createSpy('checkEditableSwimlanes'),
            getHighlighted: jasmine.createSpy('getHighlighted').and.returnValue([taskMock]),
            clearInvalidStates: jasmine.createSpy('clearInvalidStates'),
            activeScrollableElement: {
                watchMouse: jasmine.createSpy('watchMouse'),
                stopWatching: jasmine.createSpy('stopWatching')
            }
        };
        var horizontalScroll = {
            $element: angular.element('<div>')
        };
        var scrollableElement = {
            watchMouse: jasmine.createSpy('watchMouse'),
            stopWatching: jasmine.createSpy('stopWatching')
        };
        sourceScopeMock = {itemScope: {task: angular.copy(taskMock)}, $parent: {column: {swimlane: {}}}};
        destScopeMock = {$parent: {column: {swimlane: {}}, $parent: {$parent: {$parent: {scrollableElement: scrollableElement}}}}};

        parentScope.settings = {
            highlightTaskOnClick: true,
            editableSwimlanes: true
        };
        parentScope.swimlane = {
            columns: {}
        };
        kanbanWrapper.data('$kanbanController', kanbanController);
        kanbanWrapper.data('$horizontalScrollController', horizontalScroll);
        kanbanWrapper.data('$scrollableElementController', scrollableElement);
        $compile(element)(parentScope);
        parentScope.$digest();
        scope = element.isolateScope();
    }));

    //TODO: split this test stub into multiply tests
    it('should be defined', function () {
        expect(element).toBeDefined();
        var scrollCallbacks = scope.scrollCallbacks;
        scrollCallbacks.dragStart({source: sourceScopeMock});
        scrollCallbacks.itemMoved({
            source: {itemScope: sourceScopeMock},
            dest: {sortableScope: destScopeMock}
        });
        scrollCallbacks.orderChanged({source: sourceScopeMock});
        scrollCallbacks.dragEnd({source: sourceScopeMock});
        scrollCallbacks.accept(sourceScopeMock, destScopeMock);
    });

    it('should emit add resource event', function () {
        spyOn(scope, '$emit');
        scope.addResources();
        expect(scope.$emit).toHaveBeenCalledWith('kanban:add-task-assessment', scope.swimlane.id);
    });
});
