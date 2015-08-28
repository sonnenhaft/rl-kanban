angular.module('component.layout-switcher').config(function(contentLevelConfigs) {
    contentLevelConfigs.planner = {
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
    };
});
