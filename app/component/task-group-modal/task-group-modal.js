angular.module('component.task-group-modal', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).factory('taskGroupModal', function ($modal) {
    return {
        open: function (group) {
            return $modal.open({
                windowClass: 'tiny task-group-modal',
                templateUrl: 'app/component/task-group-modal/task-group-modal.html',
                resolve: {
                    group: function(){
                        return group;
                    },

                },
                controllerAs: 'modal',
                controller: function ($scope, $modalInstance, group) {
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