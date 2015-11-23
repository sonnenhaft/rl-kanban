angular.module('component.column-names', [
    'mm.foundation.tooltip',
    'mm.foundation.position',
    'mm.foundation.bindHtml'
]).directive('columnNames', function () {
    return {
        scope: {columns: '=', settings: '='},
        require: '^kanban',
        templateUrl: 'app/component/column-names/column-names.html',
        link: function (scope, element, attrs, kanban) {
            scope.toggleColumn = function (column) {
                if (scope.settings.showHideColumns) {
                    column.$collapsed = !column.$collapsed;
                    scope.$emit(column.$collapsed ? 'kanban:column:hide' : 'kanban:column:show', column.id);
                    return kanban.toggleColumn(column.id);
                }
            };
        }
    };
});