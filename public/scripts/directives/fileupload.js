'use strict';
angular.module('pillboxApp.directive', []);

angular.module('pillboxApp.directive')
	.directive('fileModel',['$parse', function($parse){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('change', function() {
					$parse(attrs.fileModel)
						.assign(scope,element[0].files[0])
					scope.$apply();
				})
			}
		}
	}]);

angular.module('pillboxApp.directive')
	.directive('isDraggable', function($rootScope) {
		return {
			restrict: "A",
			scope: {
				med:"="
			},
			link: function(scope, element, attrs) {
				
				// dragstart event
				// stores scope data as json string format to send
				element.bind('dragstart', function(e) {
					var sendData = angular.toJson(scope.med);
					// console.log(sendData);
					e.dataTransfer.setData('Text', sendData);
					$rootScope.$emit('ANGULAR_DRAG_START');
				})

				element.bind('dragover', function(e) {
					$rootScope.$emit('ANGULAR_DRAG_END');
					if (e.preventDefault) {
						e.preventDefault();
					}
					e.dataTransfer.dropEffect = "copy";
					return false;
				})

			}
		}
	});

angular.module('pillboxApp.directive')
	.directive('dropTarget', function($parse, $rootScope) {
		return {
			restrict: "A",
			scope: {
				onDrop: "&"
			},
			link: function(scope, element, attrs) {
				function onDragOver(e) {
					if (e.preventDefault) {
						e.preventDefault();
					}
					if (e.stopPropagation) {
						e.stopPropagation();
					}
					e.dataTransfer.dropEffect = "move";
					return false;
				}

				function onDrop(e) {
					if(e.preventDefault) {
						e.preventDefault();
					}
					if(e.stopPropagation) {
						e.stopPropagation();
					}
					var data = e.dataTransfer.getData('text');
					data = angular.fromJson(data);
					var fn = $parse(attrs.dropTarget);
					scope.$apply(function() {
						fn(scope, {$data: data, $event: e});
					})
					console.log(data);

				}

				$rootScope.$on('ANGULAR_DRAG_START', function() {
					element.bind('dragover', onDragOver);
					element.bind('drop', onDrop);
				})

				$rootScope.$on('ANGULAR_DRAG_END', function() {
					element.unbind('dragover', onDragOver);
					element.unbind('drop', onDrop);
				})
			}
		}
	})





