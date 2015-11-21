angular.module('demo-code.groups-debug').directive('groupsDebug', function () {
    return {
        templateUrl: 'app/demo-code/groups-debug/groups-debug.html',
        scope: {groups: '='}
    };
});