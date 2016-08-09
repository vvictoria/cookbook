var cookbook = angular.module('cookbook', ["ngRoute"]);

cookbook.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/pages/home.html?' + Date.now(),
    });
    $routeProvider.when('/recipes', {
        templateUrl: '/pages/recipes.html?' + Date.now()
    });
    $locationProvider.html5Mode(true).hashPrefix('!');

}]);