describe.module('component.kanban-board', function () {
    var element, scope, sourceScopeMock, destScopeMock, swimlaneMock, columnMock, taskMock, scrollCallbacks;

    beforeEach(inject(function ($rootScope, $compile) {
        swimlaneMock = {};
        columnMock = {
            tasks: [],
            swimlane: swimlaneMock
        };
        taskMock = {
            group: {},
            validStates: [],
            column: columnMock,
            moveToColumn: jasmine.createSpy('moveToColumn')
        };

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
        sourceScopeMock = {task: taskMock, sortableScope: {insertItem: jasmine.createSpy('removeItem')}, itemScope: {task: taskMock}, column: columnMock};
        destScopeMock = {task: taskMock, removeItem: jasmine.createSpy('removeItem'), column: columnMock, scrollableElement: scrollableElement};

        parentScope.settings = {
            highlightTaskOnClick: true,
            editableSwimlanes: true,
            acceptTasks: true
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
        scrollCallbacks = scope.scrollCallbacks;
    }));

    //TODO: split this test stub into multiply tests
    it('should be defined', function () {
        expect(element).toBeDefined();
    });

    it('scroll callbacks should have drag start handler', function () {
        scrollCallbacks.dragStart({source: sourceScopeMock});
    });

    it('scroll callbacks should have item moved handler', function () {
        scrollCallbacks.itemMoved({
            source: {itemScope: sourceScopeMock},
            dest: {sortableScope: destScopeMock}
        });
        columnMock.$barred = true;
        swimlaneMock.isTeam = false;
        scrollCallbacks.itemMoved({
            source: {itemScope: sourceScopeMock},
            dest: {sortableScope: destScopeMock}
        });
    });

    it('scroll callbacks should have order changed handler', function () {
        scrollCallbacks.orderChanged({source: sourceScopeMock});
    });

    it('scroll callbacks should have drag end handler', function () {
        scrollCallbacks.dragEnd({source: sourceScopeMock});
        taskMock.validStates = null;
        scrollCallbacks.dragEnd({source: sourceScopeMock});
    });

    it('scroll callbacks should have drag end handler', function () {
        scrollCallbacks.accept(sourceScopeMock, destScopeMock);
        swimlaneMock.isTeam = true;
        scrollCallbacks.accept(sourceScopeMock, destScopeMock);
        swimlaneMock.isTeam = false;
        columnMock.$collapsed = true;
        scrollCallbacks.accept(sourceScopeMock, destScopeMock);
        swimlaneMock.isTeam = false;
        columnMock.$collapsed = false;
        scrollCallbacks.accept(sourceScopeMock, destScopeMock);
        scope.settings.acceptTasks = false;
        scrollCallbacks.accept(sourceScopeMock, destScopeMock);
    });

    it('team swimlanes should accept cards', function () {
        columnMock.$barred = false;
        scope.settings.highlightTaskOnClick = false;
        swimlaneMock.isTeam = true;
        scrollCallbacks.itemMoved({
            source: {itemScope: sourceScopeMock},
            dest: {sortableScope: destScopeMock}
        });
    });

    it('should process multiselect', function () {
        scope.settings.highlightTaskOnClick = true;
        sourceScopeMock.task = angular.copy(taskMock);
        scrollCallbacks.itemMoved({
            source: {itemScope: sourceScopeMock},
            dest: {sortableScope: destScopeMock}
        });
    });

    it('should handle drag start event', function () {
        taskMock.group = angular.noop();
        scope.settings.highlightTaskOnClick = false;
        taskMock.validStates = null;
        scope.settings.editableSwimlanes = false;
        scrollCallbacks.dragStart({source: sourceScopeMock});
    });

    it('should rollback scrolls', function () {
        columnMock.$barred = true;
        swimlaneMock.isTeam = false;
        scrollCallbacks.itemMoved({
            source: {itemScope: sourceScopeMock},
            dest: {sortableScope: destScopeMock}
        });
        scrollCallbacks.dragStart({source: sourceScopeMock});
        scrollCallbacks.itemMoved({
            source: {itemScope: sourceScopeMock},
            dest: {sortableScope: destScopeMock}
        });
    });

    it('should emit add resource event', function () {
        spyOn(scope, '$emit');
        scope.addResources();
        expect(scope.$emit).toHaveBeenCalledWith('kanban:add-task-assessment', scope.swimlane.id);
    });
});
