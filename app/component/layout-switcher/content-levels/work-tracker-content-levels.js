angular.module('component.layout-switcher').config(function (contentLevelConfigs) {
    contentLevelConfigs.workTracker = {
        'minimum': {
            'contentTypes': true,
            'priority': true, //wt
            'grade': true,
            'id': true
        },
        'medium': {
            'contentTypes': true,
            'skillShortName': true, //wt
            'priority': true,
            'grade': true,
            'id': true,
            'flag': true,
            'preview': true//wt
        },
        'maximum': {
            'contentTypes': true,
            'skillShortName': true, //wt
            'priority': true,
            'grade': true,
            'id': true,
            'notes': true,
            'flag': true,
            'preview': true
        }
    };
});
