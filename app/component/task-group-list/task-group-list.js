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
        controller: function ($scope, $location) {
            this.cleanExpanded = function (group) {
                if (!group.$expandedGroup && $location.search().template !== 'planner') {
                    $scope.groups.forEach(function (group) {
                        group.highlightTasks(false);
                        delete group.$expandedGroup;
                    });
                    group.$expandedGroup = true;
                    group.highlightTasks(true);
                    $scope.$apply();
                }
            };

            this.removeGroup = function(group){
                $scope.groups.splice($scope.groups.indexOf(group), 1);
                this.recalculatePositions();
            };

            this.recalculatePositions = function () {
                var lines = [];

                function createLine() {
                    var line = {width: 0, groups: []};
                    lines.push(line);
                    return line;
                }

                var maxVal = $scope.columns.length - 1;

                $scope.groups.map(function (group) {return group;}).sort(function (a, b) {
                    return a.start > b.start ? 1 : -1;
                }).forEach(function (group) {
                    var hasNoLine = true;
                    group.$width = group.start + group.width;
                    lines.forEach(function (line) {
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

            var that = this;
            $scope.$watch('groups', function(){
                that.recalculatePositions();
            });
        }
    };
});