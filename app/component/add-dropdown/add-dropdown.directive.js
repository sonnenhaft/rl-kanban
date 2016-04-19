angular.module('component.add-dropdown',[
]).directive('addDropdown', function(){
    return {
        scope: {
            settings: '=',
            groups: '='
        },
        templateUrl: 'app/component/add-dropdown/add-dropdown.html'
    };
});