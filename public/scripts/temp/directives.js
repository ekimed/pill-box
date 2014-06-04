'use strict';
angular.module('pillboxApp.directive', []);
//Generate universal unique id for dragged elements
angular.module('pillboxApp.directive').factory('uuid', function () {
  var svc = {
      new: function () {
        function _p8(s) {
          var p = (Math.random().toString(16) + '000000000').substr(2, 8);
          return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
      },
      empty: function () {
        return '00000000-0000-0000-0000-000000000000';
      }
    };
  return svc;
});
angular.module('pillboxApp.directive').directive('fileModel', [
  '$parse',
  function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('change', function () {
          $parse(attrs.fileModel).assign(scope, element[0].files[0]);
          scope.$apply();
        });
      }
    };
  }
]);
angular.module('pillboxApp.directive').directive('isDraggable', [
  '$rootScope',
  function ($rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var id = angular.element(element).attr('id');
        // dragstart event
        // stores scope data as json string format to send
        element.bind('dragstart', function (e) {
          console.log(scope);
          if (scope.med.id) {
            scope.$parent.list = scope.$parent.list.filter(function (d) {
              return d.id !== scope.med.id;
            });
          }
          ;
          var id = angular.element(e.currentTarget).attr('id');
          console.log('dragstart id', id);
          var sendData = angular.toJson(scope.med);
          e.dataTransfer.setData('Text', sendData);
          e.dataTransfer.setData('id', angular.element(e.currentTarget).attr('id'));
          console.log(element, e.currentTarget);
          $rootScope.$emit('ANGULAR_DRAG_START');
        });
        element.bind('dragover', function (e) {
          // 	// $rootScope.$emit('ANGULAR_DRAG_END');
          if (e.preventDefault) {
            e.preventDefault();
          }
          e.dataTransfer.dropEffect = 'move';
          return false;
        });
      }
    };
  }
]);
angular.module('pillboxApp.directive').directive('dropTarget', [
  '$parse',
  '$rootScope',
  'uuid',
  function ($parse, $rootScope, uuid) {
    return {
      restrict: 'A',
      scope: { ngModel: '=' },
      link: function (scope, element, attrs) {
        function onDragOver(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          e.dataTransfer.dropEffect = 'move';
          return false;
        }
        function onDrop(e) {
          var id = angular.element(e.currentTarget).attr('id');
          if (!id) {
            id = uuid.new();
            angular.element(e.currentTarget).attr('id', id);
          }
          $rootScope.$emit('ANGULAR_DRAG_END');
          if (e.preventDefault) {
            e.preventDefault();
          }
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          var data = e.dataTransfer.getData('text');
          data = angular.fromJson(data);
          if (!data.id) {
            data.id = uuid.new();
          }
          scope.ngModel.push(data);
          scope.$apply();
        }
        $rootScope.$on('ANGULAR_DRAG_START', function () {
          element.bind('dragover', onDragOver);
          element.bind('drop', onDrop);
        });
        $rootScope.$on('ANGULAR_DRAG_END', function () {
          // console.log('angular_drag_end is being fired');
          element.unbind('dragover', onDragOver);
          element.unbind('drop', onDrop);
        });
      }
    };
  }
]);