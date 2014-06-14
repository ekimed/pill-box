// Data to share between controllers
angular.module('pillboxApp').factory('Data', function () {
  var factory = {};
  var data;
  factory.setData = function (dataToSet) {
    data = dataToSet;
    return data;
  };
  factory.getData = function () {
    return data;
  };
  return factory;
});
angular.module('pillboxApp').controller('FileController', [
  '$scope',
  '$upload',
  '$location',
  'fileUpload',
  'Data',
  function ($scope, $upload, $location, fileUpload, Data) {
    $scope.onFileSelect = function ($files) {
      var file = $files[0];
      console.log(file);
      $scope.upload = $upload.upload({
        url: '/fileupload',
        method: 'POST',
        file: file
      }).progress(function (evt) {
        console.log('percent: ' + parseInt(100 * evt.loaded / evt.total));
      }).success(function (data, status, headers, config) {
        console.log('data: ', data, 'status: ', status);
        Data.setData(data);
        $location.path('/index');
      });
    };
    $scope.clickInput = function () {
      $('.fileupload').click();
    };
    $scope.onhover = false;
    $scope.nothover = true;
    $scope.onHover = function (event) {
      $scope.nothover = false;
      $scope.onhover = true;
    };
    $scope.notHover = function () {
      $scope.hover = false;
      $scope.nothover = true;
    };
  }
]);
angular.module('pillboxApp').controller('MedListCtrl', [
  '$scope',
  'Data',
  function ($scope, Data) {
    $scope.data = Data.getData().data;
    $scope.name = Data.getData().firstName;
  }
]);
angular.module('pillboxApp').controller('DropDeleteCtrl', [
  '$scope',
  function ($scope) {
    $scope.list = [];
  }
]);
angular.module('pillboxApp').controller('MorningCtrl', [
  '$scope',
  'Data',
  function ($scope, Data) {
    $scope.morning = Data.getData().schedule.morningList;
  }
]);
angular.module('pillboxApp').controller('AfternoonCtrl', [
  '$scope',
  'Data',
  function ($scope, Data) {
    $scope.afternoon = Data.getData().schedule.afternoonList;
  }
]);
angular.module('pillboxApp').controller('EveningCtrl', [
  '$scope',
  'Data',
  function ($scope, Data) {
    $scope.evening = Data.getData().schedule.eveningList;
  }
]);