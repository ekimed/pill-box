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



