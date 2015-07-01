angular.module('component.add-dropdown',[])
    .directive('addDropdown', function(){
    return {
        scope: {
            settings: '='
        },
        templateUrl: 'app/component/add-dropdown/add-dropdown.html'
    };
});