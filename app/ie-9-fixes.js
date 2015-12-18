angular.module('ie-9-fixes', []).factory('fixIE9', function ($window) {
    var isIE9 = $window.navigator.appVersion.indexOf('MSIE 9') !== -1;
    var document = $window.document;

    var shims = {
        'unselect-text': function clearSelection() {
            if (document.selection && document.selection.empty) {
                document.selection.empty();
            } else if ($window.getSelection) {
                var sel = $window.getSelection();
                sel.removeAllRanges();
            }
        },
        'kanban-columns-fix': function () {
            angular.forEach(document.getElementsByClassName('kanban-board'), function (board) {
                var columnsList = Array.prototype.slice.call(board.querySelectorAll('kanban-column'));
                var max = columnsList.reduce(function (p, e) {
                    return e.scrollHeight > p ? e.scrollHeight : p;
                }, 0);
                angular.element(columnsList).css('height', max + 'px');
            });
        }
    };

    return function (fixName) {
        if (isIE9) {
            shims[fixName]();
        }
    };
});
