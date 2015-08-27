angular.module('component.modal.task-group-modal', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).factory('taskGroupModal', function ($modal) {
    return {
        open: function (group, settings) {
            return $modal.open({
                windowClass: 'tiny task-group-modal',
                templateUrl: 'app/component/modals/task-group-modal/task-group-modal.html',
                resolve: {
                    group: function(){
                        return group;
                    },
                    settings: function(){
                        return settings;
                    }
                },
                controllerAs: 'modal',
                controller: function ($scope, $modalInstance, group, settings) {
                    this.settings = settings;
                    this.group = group;
                    this.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    this.delete = function(){
                        $modalInstance.close('delete');
                    };
                }
            });
        }
    };
});