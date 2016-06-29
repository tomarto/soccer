//= wrapped

angular
    .module('prototype.index')
    .controller('AppCtrl', AppCtrl);

function AppCtrl($scope, $state, $cacheFactory, $sessionStorage, eventFactory, userFactory) {
    var vm = this;

    vm.logout = logout;

    init();

    function init() {
        if ($sessionStorage.loggedUser) {
            vm.user = $sessionStorage.loggedUser;
        }
    }

    function logout() {
        userFactory.logout()
            .then(function(response) {
                delete vm.user;
                angular.forEach($cacheFactory.info(), function(item) {
                    if (item.id !== 'templates' && item.id.indexOf('$') !== 0) {
                        $cacheFactory.get(item.id).removeAll();
                    }
                });
                eventFactory.broadcastError(undefined);
                $state.go('home', {}, {reload: true});
            }, function(response) {
                eventFactory.broadcastError(
                    'An error ocurred while logging out. Please try again later');
            });
    }

    $scope.$on('login', function(event, user) {
        vm.user = user;
    });

    $scope.$on('error', function(event, message) {
        vm.errorMsg = message;
    });

    $scope.$on('success', function(event, message) {
        vm.successMsg = message;
    });

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        vm.errorMsg = undefined;
        vm.successMsg = undefined;
    });
}
