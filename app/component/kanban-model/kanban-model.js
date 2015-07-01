angular.module('component.kanban-model').directive('kanbanModel', function(generateKanbanModel, KanbanTask, $timeout){
    return function($scope, $element, $attrs){
        $scope.$on('addToGroup', function (e, group, task) {
            var config = $scope[$attrs.model];
            var firstColumn = config.swimlanes[0].columns[0];
            task = new KanbanTask(task);
            task.attachToGroup(group);
            task.attachToColumn(firstColumn);
            config.tasks.push(task);
            task.resourceName = task.title.text;
            group.recalculate();
        });

        $scope.$watch($attrs.config, function(config){
            if (config) {
                $timeout(function(){
                    $scope[$attrs.model] = generateKanbanModel(config);
                }, 1000);

            } else {
                $scope[$attrs.model] = null;
            }
        });
    };
});