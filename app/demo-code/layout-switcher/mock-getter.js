angular.module('demo-code.layout-switcher').factory('mockGetter', function ($http) {
    function getJson(parentFolderName, fileName) {
        return $http.get(parentFolderName + fileName + '.json').then(function (data) {return data.data;});
    }

    return {
        getLayout: function (contentLevelName) {
            return getJson('app/demo-code/layout-switcher/layouts/', contentLevelName);
        },
        getContentLevel: function (contentLevelName) {
            return getJson('app/demo-code/layout-switcher/content-levels/', contentLevelName);
        }
    };
});
