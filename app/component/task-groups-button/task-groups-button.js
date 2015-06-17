angular.module('component.task-groups-button', []).directive('taskGroupsButton', function(){
   return {
       replace: true,
       scope: {value: '='},
       templateUrl: 'app/component/task-groups-button/task-groups-button.html'
   }
});