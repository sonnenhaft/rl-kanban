# KANBAN CONTROL 
##### Installation
Instal node js and ruby (for scss). Then run:
```sh 
$ npm install && bower install
```
##### Development running
Start application fist time:
```sh
$ gulp serve
```
This will create simple express server and prepare app for first time.
First time sass sources will be compiled into css. Each next time, you can run gulp default, or gulp command without any task name:
```sh
$ gulp
```
##### Test run
To run app for testing, when sources are compiled, use next command:
```sh
$ gulp host
```
##### Production build
To get production build run next command:
```sh
$ gulp build
```
##### Other tasks
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
##### Unit testing
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


## Configuration
`<kanban-model model="kanbanModel" config="config">  
    <kanban config="kanbanModel"></kanban>  
</kanban-model>`
### kanban-model
Generates kanban model from incoming configuration object, and pass it to kanban
- model: Name of Kanban model
- config: Configuration object
### kanban
Main component
- config: Kanban model name
### Configuration object
#### Tasks
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
- id: Unique identificator for task
- groupId: Unique identificator for group
- swimlaneId: Unique identificator for swimlane
- columnId: Unique identificator for column
- appRef: Icon corresponds to resource file
- appName: Resource type
- applink: Link to tasks’s source (opens in new tab)
- resourceName: Name of task’s source
- assignees: For whom this task assigned
- assigneesColor: Font color for ‘assignees’ filed 
- rating: Stars glyphs
- modifiedDate: Last modification date
- creationDate: Creation date
- ownerAppLogo: Source logo
#### Columns
	{
	'name': 'Monday',
	'id': '555b6911f5cad468b43fbe8b'
	}
- name: Displaying column name
- id: Unique identificator for column in each swimlane
#### Swimlanes
	{
	'index': 0,
	'name': 'Resources',
	'id': '555b6922f5cad468b43fbe8b',
	'addResourcesButtonText': 'Add Resources',
	'addButtonText': 'Start Adding Resources',
	'addAlertText': 'Please select skills before you add resources'
	}
- index: Index of swimlane from top to bottom
- name: Displaying name
- id: Unique identificator for swimlane
- addResourcesButtonText: Text for add button in swimlane heading
- addButtonText: Text for add button inside empty swimlane canvas
- addAlertText: Text for help block inside empty swimlane canvas
#### Task Groups
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
- masterName: Group source name
- color: Group source color
- masterRef: Group source 
- ownerName: Source owner name
-  modifiedDate: Last modification date
- creationDate: Creation date
- state: Current state (Complited, In progress, etc)
- appRef: Source icon
- groupName: Group name
- id: Unique identificator for group
#### Settings
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
	‘noContentText': 'No Tasks',
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
	‘resourceName': true,
	'assignees': true,
	'rating': false,
	'modifiedDate': false,
	'creationDate': false,
	'ownerAppLogo': false
	}
	}
- showAddNew: Showhide add
- taskModalWindowTitle: Text in header of task card modal window
- groupsCollapseButtonText: Text for collapseexpand button in groups canvas, for expanded state
- groupsExpandButtonText: Text for collapseexpand button in groups canvas, for collapsed state
- allowCopyTask: enable/disable copying functionality for task cards
- allowDeleteTask: enable/disable deleting functionality for task cards
- readOnly: enable/disable readonly state (user can only view kanban: hided and disabled dragging, expandingcollapsing, copyingdeleting; no add buttons)
- acceptTasks: enable/disable dragging task cards between swimlanes
- allowGroupExpand: enabledisable group expanding to detailed view
- noContentText: Help text inside groups canvas, when it empty
- groupContentType: Help text, describing type of groups source (used for empty state, in groups canvas)
- addResourceLinks: link and text for items in ‘Add New’ dropdown
- tasksDisplayFields: sets visibility for task cards fields (see tasks config). The common place for configuring ‘content level’.
## Events
Kanban communicate with outside directive by angular’s events system. Outside directive can subscribe and listen to next events:
### ‘kanban:task:remove' `[taskId]`
- taskId: identificator of deleted card
### ‘kanban:add-task-assessment’ `[swimlaneId]`
User clicks add button inside empty swimlane canvas
- swimlaneId: identificator of target swimlane
### ‘kanban:task:start’ `[taskId]`
User starts dragging the task card
- taskId: identificator of target task card
### ‘kanban:task:stop’ `[taskId]`
User finished dragging of task card
- taskId: identificator of target task card
### ‘kanban:task:moved’ `[taskId, fromColumnId, toColumnId]`
- taskId: identificator of moved card
- fromColumnId: identificator of previous column 
- toColumnId: identificator of new column
### 'kanban:task:orderchanged' `[taskId]`
User changed ordering of tasks in column
- taskId: identificator of target task card








#

