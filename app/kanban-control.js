/**
 * @ngdoc directive
 * @name kanban-control.directive:kanban-control
 * @restrict E
 * using the kanban input or kanban button.
 * @description
 * Top-level element of the Search Control widget.
 */
angular.module('kanban-control').directive('kanbanControl', function () { //jshint ignore: line
    return {
        templateUrl: 'app/kanban-control.html',
        scope: {
            board: '='
        },
        link: function ($scope) {

        }
    };
});
