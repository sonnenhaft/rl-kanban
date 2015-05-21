angular.module('kanban').directive('kanban', function (kanbanService) {
    asfdlkjsdfalreturn {
        templateUrl: 'app/kanban.html',
        require: '^scrollableElement',
        scope: {board: '='},
        link: function (scope, element, attrs, scrollableElement) {
            scope.columns = scope.board.columns;
            scope.groups = scope.board.groups;

            function init() {
                var length = scope.columns.length;
                angular.forEach(scope.board.tasks, function(task){
                    for (var i = 0; i < length; i++) {
                        if (task.columnId === scope.columns[i].id) {
                            scope.columns[i].tasks.push(task);
                            break;
                        }
                    }
                });
            }

            scope.scrollCallbacks = {
                dragStart: scrollableElement.watchMouse,
                dragEnd: scrollableElement.stopWatching,
                itemMoved: kanbanService.itemMoved,
                containment: '.cards-container',
                scrollableContainer: '.kanban-row'
            };

            init();
        }
    };
});
