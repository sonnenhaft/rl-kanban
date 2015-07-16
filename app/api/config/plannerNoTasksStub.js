angular.module('kanban').value('plannerNoTasksStub', {
    'settings': {
        'taskModalWindowTitle': 'Details',
        'groupsCollapseButtonText': 'SKILLS',
        'allowCopyTask': false,
        'allowDeleteTask': true,
        'contentLevel': 'low',
        'addButtonText': 'add tasks',
        'addAlertText': 'No Skills',
        'addResourcesButtonText': 'Add Resources',
        'acceptTasks': false,
        'noContentText': 'No Resources',
        'contentText': 'Resources',
        'readOnly': 'false',
        'addResourceLinks': [
            {
                'linkText': 'Add Resource',
                'link': '#'
            },
            {
                'linkText': 'Add Skill',
                'link': '#'
            }
        ]
    },
    'swimlanes': [
        {
            'id': 'Resources',
            'name': 'Resources',
            'addButtonText': 'Select Skills',
            'addAlertText': 'Please select skills before you add resources',
            'addResourcesButtonText': 'Add Resources',
            'acceptsTasks': false
        },
        {
            'id': 'Assessments',
            'name': 'Assessments',
            'addButtonText': 'Select Assessments',
            'addAlertText': 'Please select skills before you add assessments',
            'addResourcesButtonText': 'Add Assessments',
            'acceptsTasks': false
        }
    ],
    'tasks': [],
    'columns': [
        {
            'id': '20150706',
            'name': 'Monday'
        },
        {
            'id': '20150707',
            'name': 'Tuesday'
        },
        {
            'id': '20150708',
            'name': 'Wednesday'
        },
        {
            'id': '20150709',
            'name': 'Thursday'
        },
        {
            'id': '20150710',
            'name': 'Friday'
        }
    ],
    'groups': [
        {
            'id': '5ea3bfaa479de311b77c005056801da1',
            'groupName': 'Find all factor pairs for a number',
            'start': 0,
            'width': 1,
            'color': '#152C4D'
        },
        {
            'id': '5fa3bfaa479de311b77c005056801da1',
            'groupName': 'Recognize a number as a multiple of factors',
            'start': 1,
            'width': 1,
            'color': '#152C4D'
        },
        {
            'id': '60a3bfaa479de311b77c005056801da1',
            'groupName': 'Identify a multiple of a number',
            'start': 2,
            'width': 1,
            'color': '#152C4D'
        },
        {
            'id': '1ca4bfaa479de311b77c005056801da1',
            'groupName': 'Convert measurements in 1 system: 2-column table',
            'start': 3,
            'width': 1,
            'color': '#152C4D'
        }
    ]
});
