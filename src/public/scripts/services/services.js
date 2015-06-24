angular.module('pillboxApp.service', []);

angular.module('pillboxApp.service')
	.service('fileUpload', ['$http', function($http) {
		this.uploadFileToUrl = function(file, uploadUrl) {
			console.log(file)
			var fd = new FormData();
			fd.append('file', file);
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			})
			.success(function(d) {
				console.log('Success! Data was sent to server!')
			})
			.error(function(error) {
				console.error('Error! Something went wrong when sending data to server!', error)
			});
		}
	}]);

// esFactory() creates a configured client instance. Turn that instance
// into a service so that it can be required by other parts of the application
angular.module('pillboxApp.service')
   .service('esService', ['esFactory', '$q', '$location', function (esFactory, $q, $location) {
       return esFactory({
           host: 'localhost:9200',
           apiVersion: '1.6',
           log:'trace'
       });
   }]);


