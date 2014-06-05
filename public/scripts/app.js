angular.module('pillboxApp', ['angularFileUpload', 'pillboxApp.service', 'pillboxApp.directive','ngResource', 'ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider
			.when('/test', {
				templateUrl: 'partials/test.jade'
			})
			.when('/welcome', {
				templateUrl: 'partials/welcome.jade',
				controller: 'FileController'
			})
			.when('/index', {
				templateUrl: 'partials/main.jade'
			})
			.when('/list', {
				templateUrl: 'partials/list.jade',
				controller: 'MedListCtrl'
			})
			.when('/schedule', {
				templateUrl: 'partials/schedule.jade'
			})
			otherwise({
        		redirectTo: '/welcome'
      		});


		
	})