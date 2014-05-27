var app = angular.module('loginPage', ['FileUpload']);

app.controller('FileController', function($scope) {
	$scope.clickInput = function(){
		$('.fileupload').click();
	}

	
})



