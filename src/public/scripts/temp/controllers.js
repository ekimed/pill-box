(function () {
  'use strict';
  angular.module('pillboxApp').controller('FileController', [
    '$scope',
    '$upload',
    '$location',
    'fileUpload',
    'Data',
    function ($scope, $upload, $location, fileUpload, Data) {
      $scope.onFileSelect = function ($files) {
        var file = $files[0];
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
      // Change class to hover
      $scope.onHover = function (event) {
        $scope.nothover = false;
        $scope.onhover = true;
      };
      // Change class to not hover
      $scope.notHover = function () {
        $scope.hover = false;
        $scope.nothover = true;
      };
    }
  ]);
}());
(function () {
  angular.module('pillboxApp').controller('MedListCtrl', [
    '$scope',
    'Data',
    function ($scope, Data) {
      $scope.data = Data.getData().data;
      $scope.name = Data.getData().firstName;
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('pillboxApp').controller('DropDeleteCtrl', [
    '$scope',
    function ($scope) {
      $scope.list = [];
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('pillboxApp').controller('ScheduleCtrl', [
    '$scope',
    'Data',
    function ($scope, Data) {
      $scope.schedule = Data.getData().schedule;
    }
  ]);
}());
// esService fetches information about the server,
// it adds either an error or info about the server to $scope
//
// It also requires the esFactory so that it can check for a specific type of
// error which might come back from the client
(function () {
  'use strict';
  angular.module('pillboxApp').controller('SearchMedListCtrl', [
    '$scope',
    'esService',
    'esFactory',
    function ($scope, esService, esFactory) {
      $scope.esResults = [];
      $scope.isResults = false;
      $scope.selected_idx = 0;
      // query constructor for partial matching on multiple fields
      var createQuery = function (queryString) {
        var q_obj = {
            'size': 5,
            'body': {
              'query': {
                'multi_match': {
                  'query': queryString,
                  'type': 'phrase_prefix',
                  'fields': [
                    'FULL_NAME',
                    'FULL_GENERIC_NAME',
                    'BRAND_NAME',
                    'DISPLAY_NAME',
                    'DISPLAY_NAME_SYNONYM'
                  ]
                }
              }
            }
          };
        return q_obj;
      };
      // check the health of the elasticsearch connection
      esService.cluster.state({
        metric: [
          'cluster_name',
          'nodes',
          'master_node',
          'version'
        ]
      }).then(function (res) {
        $scope.clusterState = res;
        $scope.error = null;
      }).catch(function (err) {
        $scope.clusterState = null;
        $scope.error = err;
        if (err instanceof esFactory.errors.NoConnections) {
          $scope.error = new Error('Unable to connect to elasticsearch.' + 'Make sure that it is running and listening at http://localhost:9200');
        }
      });
      $scope.getIndex = function (idx) {
        // update the selected_idx
        $scope.selected_idx = idx;
        return idx;
      };
      $scope.checkKeyDown = function (event) {
        if (event.keyCode === 40 && $scope.esResults.length) {
          if ($scope.selected_idx < $scope.esResults.length) {
            $scope.selected_idx += 1;
          } else {
            $scope.selected_idx = 0;
          }
        } else if (event.keyCode === 38 && $scope.esResults.length) {
          if ($scope.selected_idx > 0) {
            $scope.selected_idx -= 1;
          } else {
            $scope.selected_idx = 0;
          }
        }
      };
      // performs elasticsearch partial match on multiple fields on rxterms index
      $scope.esQuery = function () {
        if ($scope.searchTerm.length > 2) {
          var query = createQuery($scope.searchTerm);
          esService.search(query, function (err, res) {
            if (err)
              throw err;
            $scope.esResults = res.hits.hits.map(function (i) {
              return i._source;
            });
            $scope.isResults = $scope.esResults.length ? true : false;
            return;
          });
        } else {
          // hide the drop down
          $scope.isResults = false;
          return;
        }
      };
    }
  ]);
}());