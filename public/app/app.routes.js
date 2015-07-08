angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page => /
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		// login page => /login
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    		controllerAs: 'login'
		})
		
		//all users page => /users
		.when('/users', {
		    templateUrl: 'app/views/pages/users/all.html',
		    controller: 'userController',
		    controllerAs: 'user'
		})
		
		//create pages => /users/create
		.when('/users/create/', {
		    templateUrl: 'app/views/pages/users/single.html',
		    controller: 'userCreateController',
		    controllerAs: 'user'
		})
		
		//edit pages => /users/:id
		.when('/users/:user_id', {
		    templateUrl: 'app/views/pages/users/single.html',
		    controller: 'userEditController',
		    controllerAs: 'user'
		});
		
	$locationProvider.html5Mode(true);

});