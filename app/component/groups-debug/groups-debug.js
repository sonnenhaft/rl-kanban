angular.module('component.groups-debug', [
    'component.opacity-on-changed'
]).directive('groupsDebug', function () {
    return {
        templateUrl: 'app/component/groups-debug/groups-debug.html',
        scope: {groups: '='}
    };
});