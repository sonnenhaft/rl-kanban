angular.module('component.task-groups-button', []).directive('taskGroupsButton', function(){
   return {
       replace: true,
       scope: {
           value: '=',
           settings: '='
       },
       templateUrl: 'app/component/task-groups-button/task-groups-button.html'
   };
});