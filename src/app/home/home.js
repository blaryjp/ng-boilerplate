angular.module('ngApp.home', [
  'ui.router'
])

.config(function config ($stateProvider) {
    'use strict';
    $stateProvider.state('home', {
        url: '/home',
        views: {
            "main": {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.tpl.html'
            }
        },
        data: { pageTitle: 'Home' }
    });
})

.controller('HomeCtrl', function HomeController ($scope) {
    'use strict';

});
