angular.module('events-debugger', [
    'cgNotify'
]).directive('eventsDebugger', function(notify){
    return function($scope){
        ['kanban:task:start', 'kanban:task:stop', 'kanban:task:moved', 'kanban:task:orderchanged', 'kanban:task:remove'].forEach(function(eventName){
            $scope.$on(eventName, function(e, taskId){
                notify({message: eventName + ' ' + taskId, duration: 5000, position: 'right'});
            });
        });
    };
});