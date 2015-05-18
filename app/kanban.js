angular.module('kanban').directive('kanban', function () {
    return {
        templateUrl: 'app/kanban.html',
        require: '^scrollableElement',
        scope: {board: '='},
        link: function (scope, element, attrs, scrollableElement) {
            scope.columns = scope.board.columns;
            scope.groups = scope.board.groups;

            init();

            function init() {
                var length = scope.columns.length;
                angular.forEach(scope.board.tasks, function(task){
                    for (var i = 0; i < length; i++) {
                        if (task.refColumnId === scope.columns[i].columnId) {
                            console.log(scope.columns[i])
                            scope.columns[i].tasks.push(task);
                            break;
                        }
                    }
                });
            }

            scope.scrollCallbacks = {
                dragStart: scrollableElement.watchMouse,
                dragEnd: scrollableElement.stopWatching,
                containment: '.cards-container',
                scrollableContainer: '.kanban-row'
            };
        }
    };
});
