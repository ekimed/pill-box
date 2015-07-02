angular.module('pillboxApp', ['angularFileUpload', 'pillboxApp.service', 'pillboxApp.factory', 'pillboxApp.directive','ngResource', 'ngRoute', 'elasticsearch', 'ngDialog', 'templates-main', 'DrugInteractionService'])
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
            .when('/search', {
                templateUrl: 'partials/searchMeds.jade',
                controller: 'SearchMedListCtrl'
            })
			.otherwise({
        		redirectTo: '/welcome'
      		});
	});