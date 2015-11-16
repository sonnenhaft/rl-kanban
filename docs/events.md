
## Events
The Kanban control communicates with its container via the angular event system. The container can subscribe and listen to the following events:
### 'kanban:task:remove' `[taskId]`
`taskId`: id of deleted card
### 'kanban:add-task-assessment' `[swimlaneId]`
User clicks add button inside empty swimlane canvas
`swimlaneId`: id of target swimlane
### 'kanban:task:start' `[taskId]`
User starts dragging the task card
`taskId`: id of target task card
### 'kanban:task:stop' `[taskId]`
User finished dragging task card
`taskId`: id of target task card
### 'kanban:task:moved' `[taskId, fromColumnId, toColumnId]`
`taskId`: id of moved card
`fromColumnId`: id of previous column
`toColumnId`: id of new column
### 'kanban:task:orderchanged' `[taskId]`
User changed order of tasks in column
`taskId`: id of target task card
### 'kanban:column:hide' `[columnId]`
User force column hide
`taskId`: id of target column
### 'kanban:column:show' `[columnId]`
User force column show
`taskId`: id of target column

### Example of Listening to an Event

```
angular.module('kanban').controller('KanbanTestController', function($rootScope) {
  $rootScope.$on('kanban:task:start', function(e, taskID) {
    console.log('Task', taskID, 'had a drag start event!');
  });
});
```