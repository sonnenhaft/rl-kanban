angular.module('kanban').value('tasksDisplayFields', {
    'minimum': {
        'appRef': true,
        'appName': true,
        'resourceName': true,
        'assignees': true,
        'rating': false,
        'modifiedDate': false,
        'creationDate': false,
        'ownerAppLogo': false
    },
    'medium': {
        'appRef': true,
        'appName': true,
        'resourceName': true,
        'assignees': true,
        'rating': false,
        'modifiedDate': false,
        'creationDate': false,
        'ownerAppLogo': true
    },
    'maximum': {
        'appRef': true,
        'appName': true,
        'resourceName': true,
        'assignees': true,
        'rating': true,
        'modifiedDate': false,
        'creationDate': false,
        'ownerAppLogo': true
    }
});
