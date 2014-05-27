'use strict';
angular.module('FileUpload', [])

angular.module('FileUpload')
	.directive('fileread', function(){
		return {
			scope: {
				fileread: "="
			},
			link: function(scope, element, attrs){
				element.bind('change', function(changeEvent){
					scope.$apply(function(){
					scope.fileread = changeEvent.target.files[0];
					console.log(scope.fileread)

					var reader = new FileReader();
					reader.onload = function(e) {
						console.log(this.result);
					}

					reader.readAsText(scope.fileread);

					});
				})
			}
		}
	});
