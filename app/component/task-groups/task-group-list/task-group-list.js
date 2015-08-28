angular.module('component.task-groups.task-group-list', []).directive('taskGroupList', function () {
    function add(line, group) {
        group.$lineSpace = group.start - line.width;
        line.width = group.$width;
        delete group.$width;

        line.groups.push(group);
    }

    return {
        scope: {groups: '=', columns: '=', isExpanded: '=', settings: '='},
        replace: true,
        controllerAs: 'taskGroupList',
        templateUrl: 'app/component/task-groups/task-group-list/task-group-list.html',
        controller: function ($scope) {
            this.cleanExpanded = function (group) {
                if (!$scope.settings.allowGroupExpand) {return;}
                $scope.groups.forEach(function (group) {
                    group.highlightTasks(false);
                    delete group.$expandedGroup;
                    delete group.$highlightedGroup;
                });
                group.$expandedGroup = true;
                group.highlightTasks(true);
                $scope.$apply();
            };

            this.addGroup = function(){
                $scope.$emit('kanban:add-group');
            };

            this.highlightGroup = function (group) {
                $scope.groups.forEach(function (group) {
                    group.highlightTasks(false);
                    delete group.$highlightedGroup;
                });
                group.highlightTasks(true);
                group.$highlightedGroup = true;
                $scope.$evalAsync();
            };

            this.removeGroup = function (group) {
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

                var maxVal = $scope.columns.length;

                ($scope.groups || []).map(function (group) {
                    return group;
                }).sort(function (a, b) {
                    return a.start > b.start ? 1 : -1;
                }).forEach(function (group, index) {
                    var hasNoLine = true;
                    if (!group.tasks.length) {
                        group.start = group.start || index;
                    }
                    group.$width = group.start + group.width;
                    lines.forEach(function (line) {
                        if (hasNoLine) {
                            if (line.width <= group.start && line.width <= maxVal) {
                                add(line, group);
                                hasNoLine = false;
                            }
                        }
                    });
                    if (hasNoLine) {
                        add(createLine(), group);
                    }
                });
                $scope.lines = lines;
            };

            var that = this;
            $scope.$watch('groups', function (groups) {
                if (groups) {
                    that.recalculatePositions();
                }
            });
        }
    };
});