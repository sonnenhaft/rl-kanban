angular.module('kanban-demo', [
    'demo-code.events-debugger',
    'demo-code.kanban-version' ,
    'demo-code.layout-switcher',
    'kanban'
]).config(function(kanbanVersionValueProvider, kanbanVersion){
    kanbanVersionValueProvider.set(kanbanVersion);
});