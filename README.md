# KANBAN CONTROL 
##### Installation
Install node js and ruby (for Sass). Then run:
```sh 
$ npm install && bower install
```
##### Running Development Server 
Start application fist time:
```sh
$ gulp serve
```
This will create simple express server and prepare app for first time.
First time sass sources will be compiled into css. Each next time, you can run gulp default, or gulp command without any task name:
```sh
$ gulp
```
##### Running Tests
To run app for testing, when sources are compiled, use next command:
```sh
$ gulp host
```
##### Production Build
To get production build run next command:
```sh
$ gulp build
```
##### Other Tasks
Manually to remove all generated sources (like css files and build folder and generated index.html) run:
```sh
$ gulp clean-generated
```
Manually to generate index.html run:
```sh
$ gulp inject-files
```
Manually to compile all sass files into css files run:
```sh
$ gulp sass
```
To run jshint on sources use:
```sh
$ gulp jshint
```
##### Unit Testing
You are able to run tests quickly each time we change sources with the command:
```sh
$ gulp test-dev
```
If you need run tests and stop, then we need to run:
```sh
$ gulp test
```
To jshint and test, and if everything fine to build run:
```sh
$ gulp test-and-build
```


#### Configuration
```
<kanban-model model="kanbanModel" config="config">  
    <kanban config="kanbanModel"></kanban>  
</kanban-model>
```

##### kanban-model
Generate kanban model from incoming configuration object, and pass it to kanban
`model`: A reference to the Kanban model. The Kanban control exposes this model for introspection by the container at any time.
`config`: Configuration object, defined by container.

##### kanban
Main component
`config`: A reference to the Kanban model (not the config object!)

##### Configuration object
###### Tasks
```
	{
	'id': '555b69112a241c792bd5db5d',
	'groupId': '555b69113b3485646d82e3c6',
	'swimlaneId': '555b6922f5cad468b43fbe8b',
	'columnId': '555b6911f5cad468b43fbe8b',
	'appRef': 'glyph-kw-logo',
	'appName': 'Cupidatat officia',
	'applink': '#',
	'resourceName': 'culpa enim nulla cupidatat officia',
	'assignees': 'All Groups',
	'assigneesColor': '#4f6091',
	'rating': '3',
	'modifiedDate': '2015-04-19T23:31:58.676Z',
	'creationDate': '2015-01-22T08:48:03.865Z',
	'ownerAppLogo': 'https://placeholdit.imgix.net/\~text?txtsize=8&txt=200%C3%9730&w=200&h=30'
	}
```
`id`: Unique id for task
`groupId`: Unique id for group
`swimlaneId`: Unique id for swimlane
`columnId`: Unique id for column
`appRef`: Icon corresponding to resource file
`appName`: Resource type
`applink`: Link to tasks's source (opens in new tab)
`resourceName`: Name of task's source
`assignees`: Users for whom this task assigned
`assigneesColor`: Font color for 'assignees' field 
`rating`: Number of rating stars
`modifiedDate`: Last modification date
`creationDate`: Creation date
`ownerAppLogo`: Source logo

###### Columns
```
	{
	'name': 'Monday',
	'id': '555b6911f5cad468b43fbe8b'
	}
```

`name`: column display name
`id`: Unique id for column in each swimlane

###### Swimlanes
```
	{
	'index': 0,
	'name': 'Resources',
	'id': '555b6922f5cad468b43fbe8b',
	'addResourcesButtonText': 'Add Resources',
	'addButtonText': 'Start Adding Resources',
	'addAlertText': 'Please select skills before you add resources'
	}
```
`index`: Index of swimlane, from top to bottom
`name`: Display name
`id`: Unique id for swimlane
`addResourcesButtonText`: Text for add button in swimlane header
`addButtonText`: Text for add button inside empty swimlane canvas
`addAlertText`: Text for help block inside empty swimlane canvas

###### Task Groups

```
	{
	'masterName': 'aliqua irure Lorem',
	'color': '#f3cc17',
	'ownerName': 'Coffey Perez',
	'modifiedDate': '2015-03-08T08:14:54.028Z',
	'creationDate': '2015-02-19T10:36:04.595Z',
	'state': 'Completed',
	'appRef': 'glyph-am1-logo',
	'groupName': 'elit esse laboris',
	'id': '555b69113b3485646d82e3c6'
	}
`masterName`: Group source name
`color`: Group source color
`masterRef`: Group source 
`ownerName`: Source owner name
`modifiedDate`: Last modification date
`creationDate`: Creation date
`state`: Current state (Complited, In progress, etc)
`appRef`: Source icon
`groupName`: Group name
`id`: Unique id for group

###### Settings

```
	{
	'showAddNew': false,
	'taskModalWindowTitle': 'Details',
	'groupsCollapseButtonText': 'Hide',
	'groupsExpandButtonText': 'Task Groups',
	'allowCopyTask': false,
	'allowDeleteTask': true,
	'readOnly': false,
	'addResourcesButtonText': 'Add Assessments',
	'acceptTasks': false,
	'allowGroupExpand': false,
	'noContentText': 'No Tasks',
	'groupContentType': 'Skills',
	'addResourceLinks': [
	{
	linkText: 'Add Skill',
	link: '#'
	},
	{
	linkText: 'Add Resource',
	link: '#'
	}
	],
	'tasksDisplayFields': {
	'appRef': true,
	'appName': true,
	'resourceName': true,
	'assignees': true,
	'rating': false,
	'modifiedDate': false,
	'creationDate': false,
	'ownerAppLogo': false
	}
	}
```
`showAddNew`: Show/hide Add Resources button
`taskModalWindowTitle`: Text in header of task card modal window
`groupsCollapseButtonText`: Text for collapse/expand button in groups canvas, for expanded state
`groupsExpandButtonText`: Text for collapse/expand button in groups canvas, for collapsed state
`allowCopyTask`: enable/disable copy functionality for task cards
`allowDeleteTask`: enable/disable delete functionality for task cards
`readOnly`: enable/disable read-only state (user can only view kanban; dragging, expand/collapse, copy, delete and "add" buttons are disabled)
`acceptTasks`: enable/disable dragging task cards between swimlanes
`allowGroupExpand`: enable/disable group expanding to detailed view
`noContentText`: Help text inside groups canvas, when it's empty
`groupContentType`: Help text, describing type of groups source (used for empty state, in groups canvas)
`addResourceLinks`: link and text for items in 'Add New' dropdown
`tasksDisplayFields`: sets visibility for task cards fields (see tasks config). The common place for configuring 'content level'.

#### Events
The Kanban control communicates with its container via the angular event system. The container can subscribe and listen to the following events:
##### 'kanban:task:remove' `[taskId]`
`taskId`: id of deleted card
##### 'kanban:add-task-assessment' `[swimlaneId]`
User clicks add button inside empty swimlane canvas
`swimlaneId`: id of target swimlane
##### 'kanban:task:start' `[taskId]`
User starts dragging the task card
`taskId`: id of target task card
##### 'kanban:task:stop' `[taskId]`
User finished dragging task card
`taskId`: id of target task card
##### 'kanban:task:moved' `[taskId, fromColumnId, toColumnId]`
`taskId`: id of moved card
`fromColumnId`: id of previous column 
`toColumnId`: id of new column
##### 'kanban:task:orderchanged' `[taskId]`
User changed order of tasks in column
`taskId`: id of target task card

Here is an example of listening for an event:

```
angular.module('kanban').controller('KanbanTestController', function($rootScope) {

  $rootScope.$on('kanban:task:start', function(e, taskID) {
    console.log('Task', taskID, 'had a drag start event!');
  });
});

```








