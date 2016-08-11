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
                ingredients: 'spam',
                preparation: 'spam'
            },
            {
                id: 2,
                name: 'Asparagus pie',
                date: '07/08/2016 13:45:01',
                image: '/images/recipes/asperges.jpg',
                ingredients: 'spam',
                preparation: 'spam'
            },
            {
                id: 3,
                name: 'Burger with bacon',
                date: '10/08/2016 15:12:37',
                image: '/images/recipes/burger.png',
                ingredients: 'spam',
                preparation: 'spam'
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