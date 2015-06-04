angular.module('kanban').factory('swimlanesRelationsHelper', function () {
    return {
        relateColumns: function (swimlanes, columns) {
            swimlanes.forEach(function (swimlane) {
                swimlane.columns = angular.copy(columns);

                swimlane.columns.forEach(function (column) {
                    column.swimlane = swimlane;
                });
            });
        }
    };
});