angular.module('component.draggable-labels-control', []).directive('draggableLabelsControl', function () {
    function add(line, group) {
        group.$lineSpace = group.start - line.width;
        line.width = group.$width;
        delete group.$width;

        line.groups.push(group);
    }

    return {
        scope: {groups: '=', columns: '='},
        replace: true,
        templateUrl: 'app/component/draggable-labels-control/draggable-labels-control.html',
        controller: function ($scope) {

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