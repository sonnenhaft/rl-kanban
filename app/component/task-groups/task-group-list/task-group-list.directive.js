angular.module('component.task-groups.task-group-list', [
]).directive('taskGroupList', function () {
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
        controller: function ($scope, $log) {
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

                var maxVal = $scope.columns.length, index = 0;

                ($scope.groups || []).map(function (group) {
                    return group;
                }).filter(function(group){
                    if (group.start > maxVal - 1) {
                        $log.warn('Start position of group with id ' + group.id + ' is out of columns range');
                        return false;
                    }
                    return true;
                }).sort(function (a, b) {
                    return a.start > b.start ? 1 : -1;
                }).forEach(function (group) {
                    var hasNoLine = true;
                    if (!group.tasks.length && !group.$emptyButPositioned) {
                        if (!$scope.columns[index]) {
                            index = 0;
                        }
                        if (angular.isUndefined(group.start)) {
                            group.start = index;
                            index++;
                        }
                        group.width = group.width || 1;
                        group.$emptyButPositioned = true;
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