angular.module('component.add-dropdown',[])
    .directive('addDropdown', function($animate){
    return {
        scope: {
            settings: '='
        },
        templateUrl: 'app/component/add-dropdown/add-dropdown.html',
        link: function(scope, element, attrs){
        }
    };
});