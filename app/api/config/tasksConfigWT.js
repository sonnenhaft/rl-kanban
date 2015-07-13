angular.module('kanban').value('tasksDisplayFieldsWT', {
    'minimum': {
        'appRef': true,
        'appName': true,
        'modifiedDate': false,
        'creationDate': false,
        'taskName': true, //wt
        'assigneeName': false, //wt
        'ownerPicture': false, //wt
        'state': false, //wt
        'priority': true //wt
    },
    'medium': {
        'appRef': true,
        'appName': true,
        'modifiedDate': false,
        'creationDate': false,
        'taskName': true, //wt
        'assigneeName': false, //wt
        'ownerPicture': false, //wt
        'state': true, //wt
        'priority': true //wt
    },
    'maximum': {
        'appRef': true,
        'appName': true,
        'modifiedDate': false,
        'creationDate': false,
        'taskName': true, //wt
        'assigneeName': true, //wt
        'ownerPicture': true, //wt
        'state': true, //wt
        'priority': true //wt
    }
});
