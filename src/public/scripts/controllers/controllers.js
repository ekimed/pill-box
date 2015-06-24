(function () {
    'use strict';
    angular.module('pillboxApp')
        .controller('FileController', function($scope, $upload, $location, fileUpload, Data) {
            $scope.onFileSelect = function($files) {
                var file = $files[0];

                $scope.upload = $upload.upload({
                    url: '/fileupload',
                    method: 'POST',
                    file: file
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    console.log('data: ', data, 'status: ' , status);
                    Data.setData(data);
                    $location.path('/index');
                });
            };
            $scope.clickInput = function(){
                $('.fileupload').click();
            };

            $scope.onhover = false;
            $scope.nothover = true;

            // Change class to hover
            $scope.onHover = function(event) {
                $scope.nothover = false;
                $scope.onhover = true;
            };

            // Change class to not hover
            $scope.notHover = function() {
                $scope.hover = false;
                $scope.nothover = true;
            };


        });
})();

(function () {
    angular.module('pillboxApp')
        .controller('MedListCtrl', function($scope, Data) {
            $scope.data = Data.getData().data;
            $scope.name = Data.getData().firstName;

        });
})();

(function () {
    'use strict';
    angular.module('pillboxApp')
        .controller('DropDeleteCtrl', function($scope) {
            $scope.list = [];
        });
})();

(function () {
    'use strict';
     angular.module('pillboxApp')
        .controller('ScheduleCtrl', function($scope, Data) {
            $scope.schedule = Data.getData().schedule;
        });
})();


// esService fetches information about the server,
// it adds either an error or info about the server to $scope
//
// It also requires the esFactory so that it can check for a specific type of
// error which might come back from the client
(function () {
    'use strict';
    angular.module('pillboxApp')
        .controller('SearchMedListCtrl', function ($scope, esService, esFactory) {
            var query = {
                "size": 5,
                "body": {
                    "query": {
                        "multi_match": {
                            "query": $scope.searchTerm,
                            "type": "phrase_prefix",
                            "fields": ["FULL_NAME", "FULL_GENERIC_NAME", "BRAND_NAME", "DISPLAY_NAME", "DISPLAY_NAME_SYNONYM"]
                        }
                    }

                }
            };
            $scope.esResults = [];
            $scope.isResults = false;


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
                    $scope.error = new Error('Unable to connect to elasticsearch.' +
                        'Make sure that it is running and listening at http://localhost:9200');
                }
            });

            console.log($scope);

            $scope.esQuery = function () {
                if ($scope.searchTerm.length > 2) {
                    esService.search(query, function (err, res) {
                        if (err) throw (err);

                        $scope.esResults = res.hits.hits.map(function (i) {
                            return i._source;
                        });

                        if ($scope.esResults.length) {
                            $scope.isResults = true;
                        } else {
                            $scope.isResults = false;
                        }

                        return;
                    });
                } else { // hide the drop down
                    $scope.isResults = false;
                    return;
                }
            };
        });
})();









