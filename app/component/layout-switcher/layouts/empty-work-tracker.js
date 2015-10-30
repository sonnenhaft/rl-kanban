angular.module('component.layout-switcher').config(function (layoutSwitcherConfigs) {
    layoutSwitcherConfigs.emptyWorkTracker = {
        'tasks': [ ],
        'columns': [
            {
                'name': 'Shell Completion',
                'id': '555b6911f5cad468b43fbe8b'
            },
            {
                'name': 'Creation',
                'id': '555b6911a9ce3b29e498cae5'
            },
            {
                'name': 'Intake Review',
                'id': '555b6911b55afadc0db29d98'
            },
            {
                'name': 'Edit',
                'id': '555b6911faa6e347b8f89d13'
            },
            {
                'name': 'Buy In',
                'id': '555b6911ba6d349f6253cd85'
            },
            {
                'name': 'Copy Edit',
                'id': '555b6911ba6d349f6253cd86'
            },
            {
                'name': 'Programming',
                'id': '555b6911ba6d349f6253cd87'
            },
            {
                'name': 'Math proof',
                'id': '555b6911ba6d349f6253cd88'
            },
            {
                'name': 'Fast Check',
                'id': '555b6911ba6d349f6253cd89'
            }
        ],
        'swimlanes': [
            {
                'name': 'Unassigned',
                'id': '555b6922f5cad468b43fbe8b'
            },
            {
                'name': 'Jessica Maccan',
                'id': '555b6933a9ce3b29e498cae5'
            },
            {
                'name': 'Matthew Ghibli',
                'id': '555b6933a9ce3b29e498cae6'
            },
            {
                'name': 'Team B',
                'id': '555b6933a9ce3b29e498cae7'
            },
            {
                'name': 'Team C',
                'id': '555b6933a9ce3b29e498cae8'
            }
        ],
        'settings': {
            'taskModalWindowTitle': 'Task information',
            'groupsCollapseButtonText': 'Task Groups',
            'groupsExpandButtonText': 'Task Groups',
            'allowCopyTask': false,
            'allowDeleteTask': false,
            'disableDefaultMessaging': true,
            'allowEmptySwimlanes': true,
            'hideGroups': true,
            'legacyCardModal': true,
            'acceptTasks': true,
            'allowGroupExpand': true,
            'contentText': 'Tasks',
            'contentTextSingleItem': 'Task'
        }
    };
});
