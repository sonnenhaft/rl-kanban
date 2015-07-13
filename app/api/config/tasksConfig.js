angular.module('kanban').value('tasksDisplayFields', {
    'minimum': {
        'appRef': true,
        'appName': true,
        'resourceName': true,
        'assignees': true,
        'rating': false,
        'modifiedDate': false,
        'creationDate': false,
        'ownerAppLogo': false,
        'taskName': true, //wt
        'assigneeName': true, //wt
        'ownerPicture': false, //wt
        'state': false, //wt
        'priority': false //wt
    },
    'medium': {
        'appRef': true,
        'appName': true,
        'resourceName': true,
        'assignees': true,
        'rating': false,
        'modifiedDate': false,
        'creationDate': false,
        'ownerAppLogo': true,
        'taskName': true, //wt
        'assigneeName': true, //wt
        'ownerPicture': false, //wt
        'state': true, //wt
        'priority': true //wt
    },
    'maximum': {
        'appRef': true,
        'appName': true,
        'resourceName': true,
        'assignees': true,
        'rating': true,
        'modifiedDate': false,
        'creationDate': false,
        'ownerAppLogo': true,
        'taskName': true, //wt
        'assigneeName': true, //wt
        'ownerPicture': true, //wt
        'state': true, //wt
        'priority': true //wt
    }
});
