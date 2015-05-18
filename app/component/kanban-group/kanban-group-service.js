var columns = {};
return {
    debug: function () {
        console.log(columns);
    },
    registerColumn: function (colName, colScope) {
        columns[colName] = colScope;
    },
    getColumn: function (colName) {
        return columns[colName];
    },
    wipeColumns: function () {
        columns = {};
    }
};