angular.module('component.kanban-column')
    .factory('kanbanColumnService', function () {
        var columns = [];
        return {
            registerColumn: function (index, columnScope) {
                columns[index] = columnScope;
            },
            getColumn: function (index) {
                return columns[index];
            },
            insertItem: function (columnIndex, itemData) {
                var destScope = columns[columnIndex];
                return destScope.insertItem(destScope.modelValue.length + 1, itemData);
            },
            removeItem: function (columnId, index) {
                var destScope = columns[columnId];
                destScope.removeItem(index);
            },
            canMove: function(index){
                return index >= 0 && index < columns.length;
            }
        };
    });