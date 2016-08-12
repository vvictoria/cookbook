angular.module('appFilereader', []).directive('appFilereader', function($q) {
    // http://stackoverflow.com/a/19121983
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;

                ngModel.$render = function() {};

                element.bind('change', function(e) {
                    var element = e.target;

                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function(values) {
                            if (element.multiple) ngModel.$setViewValue(values);
                            else ngModel.$setViewValue(values.length ? values[0] : null);
                        });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            deferred.resolve(e.target.result);
                        };
                        reader.onerror = function(e) {
                            deferred.reject(e);
                        };
                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }

                }); //change

            } //link
    }; //return
});

var cookbook = angular.module('cookbook', ["ngRoute", "ngStorage", "appFilereader"]);

function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return pad(d.getDate()) + '/' + pad(d.getMonth()+1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
};

cookbook.run(function($localStorage) { // Можна перенести і вкінець, бо ств-ся при завантаж сайту?
    window.$localStorage = $localStorage;

    if (!$localStorage.recipesList) { // only first time
        $localStorage.recipesList = [
            {
                id: 1,
                name: 'Dessert with ice-cream',
                date: '05/08/2016 18:32:45',
                image: '/images/recipes/dessert.jpg',
                ingredients: '4 cups of vanilla ice cream, 2 cups of peach ice cream, 3 large ripe peaches, peeled and cut into eighths, 2 tablespoons unsalted butter, 2 tablespoons brown sugar + a pinch of Cardamom and a pinch of salt',
                preparation: ' For Terrine: Line a small loaf pan with plastic wrap. Scoop 2 cups vanilla ice cream into the bottom and smooth to form a layer. Refrigerate 30 minutes. Repeat with the peach ice cream followed by the remaining vanilla ice cream, freezing 30 minutes between layers. Once complete, freeze for a minimum of 4 hours to overnight. For Peaches: Melt butter in a skillet or saute pan over medium high heat. Add sugar, peaches, a pinch of cardamom and salt. Saute 3 to 5 minutes until soft and coated. To serve, remove terrine from freezer, submerge in warm water to release it, turn out on a serving platter and top with the peach mixture. Slice and serve.'
            },
            {
                id: 2,
                name: 'Asparagus pie',
                date: '07/08/2016 13:45:01',
                image: '/images/recipes/asperges.jpg',
                ingredients: 'flour, salt, sugar, black pepper, thyme, milk, eggs, lemon zest, asparagus, trimmed and cut into 2-inch pieces, salt, butter ',
                preparation: 'Preheat oven to 350 degrees F (175 degrees C). Butter the inside edges of a 2-quart casserole dish. Stir flour, 1/2 teaspoon salt, sugar, black pepper, fresh thyme, and milk together in a large bowl until smooth. Whisk eggs and lemon zest into milk mixture to form a smooth batter. ...'
            },
            {
                id: 3,
                name: 'Burger with bacon',
                date: '10/08/2016 15:12:37',
                image: '/images/recipes/burger.png',
                ingredients: '2 pounds beef, black pepper, salt. Burger buns, cheese slices, lettuce, tomato slices, red onions, pickles. Ketchup, mustard, and mayo.',
                preparation: 'On a large rimmed baking sheet, toss the cubes of beef and bacon together with a generous amount of cracked black pepper. Spread into a thin layer and freeze until very cold, at least one hour. Place the grinder attachments into the freezer to chill. ...'
            },
        ];
        $localStorage.lastId = 3;
    }
});

cookbook.controller('CreateRecipeController', function($scope, $localStorage, $location) {
    $scope.saveRecipe = function() {
        if(($scope.name == null) || ($scope.ingredients == null) || ($scope.preparation == null) || ($scope.image == null)) {
            alert ('Fulfill all fields, please'); 
        } else {
            $localStorage.recipesList.push({
                id: $localStorage.lastId + 1,
                name: $scope.name,
                date: convertDate(new Date()),
                image: $scope.image,
                ingredients: $scope.ingredients,
                preparation: $scope.preparation
            });
            $localStorage.lastId++;

            alert('Your recipe is saved');
            $location.path('/recipe/' + $localStorage.lastId);
        };
    }

});

cookbook.controller('RecipesListController', function($scope, $localStorage, $location) {
    $scope.recipes = $localStorage.recipesList;
    $scope.openRecipe = function(id) {
        $location.path('/recipe/' + id);
    };
});

var findObjectById = function (list, id) {
    for (var i = 0; i < list.length; i++) {
        if (id == list[i].id) {
            return list[i];
        }
    }
}

cookbook.controller('EditRecipeController', function($scope, $localStorage, $routeParams, $location) {
    var recipe = findObjectById($localStorage.recipesList, $routeParams.id);
    $scope.name = recipe.name;
    $scope.ingredients = recipe.ingredients;
    $scope.preparation = recipe.preparation; 
    $scope.saveRecipe = function() {
        recipe.name = $scope.name;
        recipe.ingredients = $scope.ingredients;
        recipe.preparation = $scope.preparation;
        if ($scope.image) {
            recipe.image = $scope.image;
        }
        $location.path('/recipe/' + recipe.id);
    }
});

cookbook.controller('ViewRecipeController', function($scope, $localStorage, $routeParams, $location) {
    var recipe = findObjectById($localStorage.recipesList, $routeParams.id);
    $scope.recipe = recipe;
    $scope.edit = function() {
        $location.path('/recipe/' + recipe.id + '/edit');
    }
});


cookbook.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/pages/home.html'
    });
    $routeProvider.when('/favourites', {
        templateUrl: '/pages/favourites.html',
        controller: 'RecipesListController'
    });
    $routeProvider.when('/create', {
        templateUrl: '/pages/create.html',
        controller: 'CreateRecipeController'
    });
    $routeProvider.when('/recipe/:id', {
        templateUrl: '/pages/recipe.html',
        controller: 'ViewRecipeController'
    });
    $routeProvider.when('/recipe/:id/edit', {
        templateUrl: '/pages/create.html',
        controller: 'EditRecipeController'
    });


    // $routeProvider.when('/articles/:category/:date/:id', {
    //     templateUrl: '/pages/create.html',
    //     controller: 'ViewRecipeController'
    // });


    // site.com/articles/news/12-10-2009/123897



    // {
    //     category: "news",
    //     date: "12-10-2009",
    //     id: "123897"
    // }



    // $locationProvider.html5Mode(false).hashPrefix('!');
}]);

// scope обмежужється одним шаблоном - r. 1 контроллер на 1 html В ОДИН МОМЕНТ ЧАСУ