angular.module('component.kanban-model').directive('kanbanModel', function (generateKanbanModel, KanbanTask) {
    return function ($scope, $element, $attrs) {
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

        $scope.$on('update:kanban:card', function (e, newCard) {
            var config = $scope[$attrs.config].tasks;
            if (!config || !config.length || !newCard || !newCard.id) {return;}
            var task = config.filter(function (oldCard) {return oldCard.id === newCard.id;})[0];
            var model = $scope[$attrs.model].tasks;
            var modelTask = model.filter(function (modelTask) {return modelTask.id === newCard.id;})[0];
            if (!task || !modelTask) {return;}

            model[model.indexOf(modelTask)] = modelTask.replace(angular.extend(task, newCard));
        });

        $scope.$watch($attrs.config, function (config) {
            if (config) {
                $scope[$attrs.model] = generateKanbanModel(config);
            } else {
                $scope[$attrs.model] = null;
            }
        });
    };
});