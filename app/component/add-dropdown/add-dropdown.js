angular.module('component.add-dropdown',[])
    .directive('addDropdown', function($animate){
    return {
        scope: {config: '='},
        templateUrl: 'app/component/add-dropdown/add-dropdown.html',
        link: function(scope, element, attrs){
            scope.linkItems = {
                "Add Skill": "#",
                "Add Resource": "#"
            };
        }
    };
});