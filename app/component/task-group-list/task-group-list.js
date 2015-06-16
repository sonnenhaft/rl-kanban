angular.module('component.task-group-list', []).directive('taskGroupList', function () {
    function add(line, group) {
        group.$lineSpace = group.start - line.width;
        line.width = group.$width;
        delete group.$width;

        line.groups.push(group);
    }

    return {
        scope: {groups: '=', columns: '=', isExpanded: '='},
        replace: true,
        controllerAs: 'taskGroupList',
        templateUrl: 'app/component/task-group-list/task-group-list.html',
        controller: function ($scope) {

            this.lastGroup = null;
            this.expandGroup = function(group) {
                if (this.lastGroup) {
                    delete this.lastGroup.$expandedGroup;
                }
                this.lastGroup = group;
                this.lastGroup.$expandedGroup = true;
            };

            this.recalculatePositions = function() {
                var lines = [];

                function createLine(){
                    var line = {width: 0, groups: []};
                    lines.push(line);
                    return line;
                }
                var maxVal = $scope.columns.length - 1;

                $scope.groups.map(function(group){return group}).sort(function(a, b){
                    return a.start > b.start ? 1 : -1;
                }).forEach(function(group){
                    var hasNoLine = true;
                    group.$width = group.start + group.width;
                    lines.forEach(function(line){
                        if (hasNoLine && line.width <= group.start && line.width + group.$width <= maxVal) {
                            add(line, group);
                            hasNoLine = false;
                        }
                    });
                    if (hasNoLine) {
                        add(createLine(), group);
                    }
                });
                $scope.lines = lines;
            };
            this.recalculatePositions()
        }
    };
});