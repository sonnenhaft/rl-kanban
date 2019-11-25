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
* `id`: Unique id for task
* `groupId`: Unique id for group
* `swimlaneId`: Unique id for swimlane
* `columnId`: Unique id for column
* `appRef`: Icon corresponding to resource file
* `appName`: Resource type
* `applink`: Link to tasks's source (opens in new tab)
* `resourceName`: Name of task's source
* `assignees`: Users for whom this task assigned
* `assigneesColor`: Font color for 'assignees' field
* `rating`: Number of rating stars
* `modifiedDate`: Last modification date
* `creationDate`: Creation date
* `ownerAppLogo`: Source logo
* `preview`: show/hide preview button on card (tasksDisplayFields.preview should be true)

#### Columns
```
	{
	'name': 'Monday',
	'id': '555b6911f5cad468b43fbe8b'
	}
```

* `name`: column display name
* `id`: Unique id for column in each swimlane

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
* `index`: Index of swimlane, from top to bottom
* `name`: Display name
* `id`: Unique id for swimlane
* `addResourcesButtonText`: Text for add button in swimlane header
* `addButtonText`: Text for add button inside empty swimlane canvas
* `addAlertText`: Text for help block inside empty swimlane canvas

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
```
* `masterName`: Group source name
* `color`: Group source color
* `masterRef`: Group source
* `ownerName`: Source owner name
* `modifiedDate`: Last modification date
* `creationDate`: Creation date
* `state`: Current state (Complited, In progress, etc)
* `appRef`: Source icon
* `groupName`: Group name
* `id`: Unique id for group

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
  'barredColumnMessage': 'Workflow State Unavailable for Selected Card',
  'disableDefaultMessaging': true,
  'enableMultiSelect': false,
  'allowEmptySwimlanes': true,
  'hideGroups': true,
  'legacyCardModal': true,
  'acceptTasks': true,
  'allowGroupExpand': true,
  'editableSwimlanes': true,
  'containment': true,
  'barredColumnMessage': 'Workflow State Unavailable for Selected Card',
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
* `acceptTasks`: enable/disable dragging task cards between swimlanes
* `addResourceLinks`: link and text for items in 'Add New' dropdown
* `allowCopyTask`: enable/disable copy functionality for task cards
* `allowDeleteTask`: enable/disable delete functionality for task cards
* `allowEmptySwimLanes`: Allow empty swim lanes
* `allowGroupExpand`: enable/disable group expanding to detailed view
* `barredColumnMessage`: Text to show when in an invalid workflow state column
* `disableDefaultMessaging`: Hide UI in empty swim lanes
* `enableMultiSelect`: enable/disable selection of multiple task cards with ctrl-click
* `groupContentType`: Help text, describing type of groups source (used for empty state, in groups canvas)
* `groupsCollapseButtonText`: Text for collapse/expand button in groups canvas, for expanded state
* `groupsExpandButtonText`: Text for collapse/expand button in groups canvas, for collapsed state
* `hideGroups`: Hides the Task Groups section at the top of the page.
* `highlightTaskOnClick`: Show a highlight (i.e. selection) around a task card when it's clicked
* `legacyCardModal`: If false, show the built-in modal when task card is clicked.  Else a `kanban:task:modalopen` event will be fired (and you can hook up a custom modal).
* `noContentText`: Help text inside groups canvas, when it's empty
* `readOnly`: enable/disable read-only state (user can only view kanban; dragging, expand/collapse, copy, delete and "add" buttons are disabled)
* `showAddNew`: Show/hide Add Resources button
* `taskModalWindowTitle`: Text in header of task card modal window
* `tasksDisplayFields`: sets visibility for task cards fields (see tasks config). The common place for configuring 'content level'.
* `editableSwimlanes`: enable\disable per swimlane Edit Mode feature.
* `containment`: enable\disable dragging cards outside of Swim Lane
