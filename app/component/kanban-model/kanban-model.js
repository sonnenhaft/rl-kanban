angular.module('component.kanban-model').directive('kanbanModel', function(generateKanbanModel, KanbanTask){
    return function($scope, $element, $attrs){
        $scope.$on('addToGroup', function (e, group, task) {
            var config = $scope[$attrs.model];
            var firstColumn = config.swimlanes[0].columns[0];
            task = new KanbanTask(task);
            task.attachToGroup(group);
            task.attachToColumn(firstColumn);
            config.tasks.push(task);
            task.taskName = task.title.text;
            group.recalculate();
        });

        $scope.$watch($attrs.config, function(config){
            if (config) {
                $scope[$attrs.model] = generateKanbanModel(config);
            } else {
                $scope[$attrs.model] = null;
            }
        });
    }
});