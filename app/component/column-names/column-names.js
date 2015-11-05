angular.module('component.column-names', [
    'mm.foundation.tooltip',
    'mm.foundation.position',
    'mm.foundation.bindHtml'
]).directive('columnNames', function () {
    return {
        scope: {columns: '=', settings: '='},
        require: '^kanban',
        replace: true,
        templateUrl: 'app/component/column-names/column-names.html',
        link: function (scope, element, attrs, kanban) {
            scope.toggleColumn = function (column) {
                column.$collapsed = !column.$collapsed;
                return kanban.toggleColumn(column.id);
            }
        }
    };
});