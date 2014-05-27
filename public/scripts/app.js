angular.module('pillboxApp', [
	'ngResource', 'ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider
			.when('/login', {
				templateUrl: 'partials/login',
				controller: 'FileController'
			})

		
	})