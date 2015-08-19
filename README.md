# KANBAN CONTROL 
## Development Setup
### Installation
Install node js and ruby (for Sass). Then run:
```sh 
$ npm install && bower install
```
### Running Development Server 
Start application for the first time:
```sh
$ gulp serve
```
This will create a simple express server and prepare app for first time.
The first time, sass source will be compiled into css. Each subsequent time, you can run `gulp default` or `gulp` with no args.

To run app for automated testing or continuous integration, without live reload:
```sh
$ gulp host
```
### Production Build
```sh
$ gulp build
```
Production files are move into the 'deployment' folder.  Note, both minified and unminfied files are generated.
#### "Vendor" Files
For compilation, source files are classified as Vendor or Custom.  Vendor files are assumed to be included in the container page (e.g.: Underscore.js, Angular, Foundation CSS, etc.). Vendor files get compiled into "deployment/js/vendor.js" and "deployment/css/vendor.css".  Vendor files are only necessary to include when running the control in standalone mode. 
Custom files are unique to the Kanban control.  Custom files get compiled into "depployment/js/rlkanban.js" and "deployment/css/rlkanban.css".  

### Other Tasks
Remove all generated source (css files, build folder, and generated index.html):
```sh
$ gulp clean-generated
```
Manually generate index.html:
```sh
$ gulp inject-files
```
Manually compile all sass files into css:
```sh
$ gulp sass
```
To run jshint on source:
```sh
$ gulp jshint
```
### Unit Testing
To run tests quickly each time code is changed:
```sh
$ gulp test-dev
```
To run tests and stop:
```sh
$ gulp test
```
Run jshint and tests; build if everything is fine:
```sh
$ gulp test-and-build
```

Generate documentation:
```sh
$ gulp ngdocs
```

## Configuration
Add the Kanban control to a container Angular app. as follows:
```
<kanban-model model="kanbanModel" config="config">  
    <kanban config="kanbanModel"></kanban>  
</kanban-model>
```

### kanban-model directive
The kanban model is generated based on the incoming configuration object, and is passed to the Kanban directive.
`model`: A reference to the Kanban model. The Kanban control exposes this model for introspection by the container at any time.
`config`: Configuration object, defined by container.

### kanban directive
This is the main component of the Kanban control.
`config`: A reference to the Kanban model (not the config object!)

### Configuration object
See app/api/config/ for full stub files.
#### Tasks
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

#### Columns
```
	{
	'name': 'Monday',
	'id': '555b6911f5cad468b43fbe8b'
	}
```

`name`: column display name
`id`: Unique id for column in each swimlane

#### Swimlanes
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

#### Task Groups

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
```

#### Settings

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

### Example of Listening to an Event

```
angular.module('kanban').controller('KanbanTestController', function($rootScope) {

  $rootScope.$on('kanban:task:start', function(e, taskID) {
    console.log('Task', taskID, 'had a drag start event!');
  });
});

```
