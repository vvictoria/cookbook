var cookbook = angular.module('cookbook', ["ngRoute"]);

cookbook.controller('RecipesController', function($scope) {
    $scope.recipes = [
        {
            title: 'Test 1',
            date: 'yesterday',
            image: '/images/recipes/asperges.jpg'
        },
        {
            title: 'Test 2',
            date: 'today',
            image: '/images/recipes/asperges.jpg'
        },
        {
            title: 'Test 3',
            date: 'tomorrow',
            image: '/images/recipes/asperges.jpg'
        },
    ];

    $scope.addRecipe = function() {
        $scope.recipes.push({
            title: 'Test ' + Math.random(),
            date: 'tomorrow',
            image: '/images/recipes/asperges.jpg'
        });
    };
});

cookbook.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/pages/home.html?' + Date.now(),
    });
    $routeProvider.when('/recipes', {
        templateUrl: '/pages/recipes.html?' + Date.now(),
        controller: 'RecipesController'
    });
    $locationProvider.html5Mode(true).hashPrefix('!');

}]);