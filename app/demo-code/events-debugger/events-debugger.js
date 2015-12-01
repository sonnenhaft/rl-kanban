angular.module('demo-code.events-debugger', [
    'component.is-touch',
    'cgNotify'
]).directive('eventsDebugger', function (eventsToDebug, notify, $log, isTouch) {
    return function ($scope) {
        if (isTouch) {
            return;
        }
        eventsToDebug.forEach(function (eventName) {
            $scope.$on(eventName, function () {
                var args = Array.prototype.slice.call(arguments, 1);
                var message = eventName + ' ' + args.join(' ');
                $log.info(message);
                notify({message: message, duration: 5000, position: 'right'});
            });
        });
    };
}).value('eventsToDebug', [
    'kanban:task:start',
    'kanban:task:stop',
    'kanban:task:moved',
    'kanban:task:orderchanged',
    'kanban:task:remove',
    'kanban:task:modalopen',
    'kanban:add-group',
    'kanban:add-task',
    'kanban:add-task-assessment',
    'kanban:column:hide',
    'kanban:column:show'
]);