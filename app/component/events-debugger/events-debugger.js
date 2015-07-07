angular.module('events-debugger', [
    'cgNotify'
]).directive('eventsDebugger', function(notify){
    return function($scope){
        ['kanban:task:start', 'kanban:task:stop', 'kanban:task:moved', 'kanban:task:orderchanged', 'kanban:task:remove'].forEach(function(eventName){
            $scope.$on(eventName, function(e, task, arg1, arg2){
                var args = Array.prototype.slice.call(arguments, 1);
                notify({
                    message: eventName + ' '+  args.join(' '),
                    duration: 5000,
                    position: 'right'
                });
            });
        });
    };
});