angular.module('ngApp', [
    'ui.router',
    'templates-app',
    'templates-common',
    'ngApp.home'
])

.config(function ($stateProvider, $urlRouterProvider) {
    'use strict';
    $urlRouterProvider.otherwise( '/home' );
})

.controller('AppCtrl', function ($scope, $location) {
    'use strict';
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (angular.isDefined(toState.data.pageTitle)) {
            $scope.pageTitle = toState.data.pageTitle + ' | ngApp';
        }
    });
});
