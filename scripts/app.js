var cookbook = angular.module('cookbook', ["ngRoute", "ngStorage"]);

function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return pad(d.getDate()) + '/' + pad(d.getMonth()+1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
};

cookbook.controller('RecipesController', function($scope, $localStorage) {
    $scope.recipes = $localStorage.recipesList;

    $scope.addRecipe = function() {
        $localStorage.recipesList.push({
            title: $scope.name,
            date: convertDate(new Date()),
            image: '/images/recipes/praline.jpg'
        });
        // $localStorage.recipesList.push({})
        alert('saved');
        document.getElementById('name').value = '';
        document.getElementById('ingridients').value = '';
        document.getElementById('preparation').value = '';
    };

});

cookbook.controller('FavouritesController', function($scope) {
    $scope.openRecipe = function() {
        window.location = '/recipe?id=${recipeId}'
    };
});

cookbook.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/pages/home.html?' + Date.now(),
    });
    $routeProvider.when('/favourites', {
        templateUrl: '/pages/favourites.html?' + Date.now(),
        controller: 'RecipesController'
    });
    $routeProvider.when('/create', {
        templateUrl: '/pages/create.html?' + Date.now(),
        controller: 'RecipesController'
    });
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

cookbook.run(function($localStorage) {
    if (!$localStorage.recipesList) {
        $localStorage.recipesList = [
            {
                title: 'Dessert with ice-cream',
                date: '05/08/2016 18:32:45',
                image: '/images/recipes/dessert.jpg'
            },
            {
                title: 'Asparagus pie',
                date: '07/08/2016 13:45:01',
                image: '/images/recipes/asperges.jpg'
            },
            {
                title: 'Burger with bacon',
                date: '10/08/2016 15:12:37',
                image: '/images/recipes/burger.png'
            },
        ];
    }
});
