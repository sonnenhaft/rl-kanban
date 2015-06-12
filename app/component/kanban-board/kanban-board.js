angular.module('component.kanban-board',[
    'component.kanban-card',
    'component.scrollable-element'
]).directive('kanbanBoard', function ($animate) {
    return {
        templateUrl: 'app/component/kanban-board/kanban-board.html',
        require: '^scrollableElement',
        scope: {
            columns: '=',
            collapse: '='
        },
        replace: true,
        link: function (scope, element, attrs, scrollableElement) {
            scope.scrollCallbacks = {
                dragStart: function(e){
                    e.source.itemScope.task.group.highlight = true;
                    scrollableElement.watchMouse();
                },
                dragEnd: function(e){
                    e.source.itemScope.task.group.highlight = false;
                    scrollableElement.stopWatching();
                },
                itemMoved: function (e) {
                    var task = e.source.itemScope.task;
                    var toSwimlane = e.dest.sortableScope.$parent.column.swimlane;
                    var fromSwimlane = e.source.sortableScope.$parent.column.swimlane;
                    task.column = e.dest.sortableScope.$parent.column;
                    task.columnId = task.column.id;
                    task.swimlaneId = task.column.swimlane.id;
                    task.group.recalculate();
                    if (toSwimlane.id !== fromSwimlane.id) {
                        toSwimlane.$tasksCount++;
                        fromSwimlane.$tasksCount--;
                    }
                }
            };

            function toggleCollapse(value) {
                if (value) {
                    element
                        .css({height: element[0].scrollHeight + 'px'})
                        .removeClass('collapse')
                        .addClass('collapsing');

                    $animate.removeClass(element, 'in', {
                        to: {height: '0'}
                    }).then(function(){
                        element.css({height: '0'});
                        element.removeClass('collapsing');
                        element.addClass('collapse');
                    });
                } else {
                    element.removeClass('collapse').addClass('collapsing');
                    $animate.addClass(element, 'in', {
                        to: { height: element[0].scrollHeight + 'px' }
                    }).then(function(){
                        element.removeClass('collapsing');
                        element.css({height: 'auto'});
                    });
                }
            }

            scope.$watch('collapse', toggleCollapse);

        }
    };
});