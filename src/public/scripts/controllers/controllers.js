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
        .controller('MedListCtrl', function($scope, $q, $timeout, Data, esService, InteractionAPI, ngDialog, DrugInteraction) {
            var esData = $scope.esData = [];
            $scope.ddiDetected = false;
            $scope.tooltipMsg = 'Drug interactions between your medications were detected. Click to view.';

            // TODO modal dialog for DDI
            $scope.openModal = function () {
                ngDialog.open({
                    template: 'server/views/modal/templates/ddi_template.jade',
                    className: 'ngdialog-theme-default',
                    controller: 'MedListCtrl'
                });
            };

            // creates a query object for elasticsearch
            var createQuery = function (queryStr, type) {
                var query_type = {
                    PARTIAL: "phrase_prefix",
                    DEFAULT: "best_fields"
                };

                var query = {
                    "size": 5,
                    "body": {
                        "query": {
                            "multi_match": {
                                "query": queryStr,
                                "type": query_type[type],
                                "fields": ["FULL_NAME", "FULL_GENERIC_NAME", "BRAND_NAME", "DISPLAY_NAME", "DISPLAY_NAME_SYNONYM"]
                            }
                        }
                    }
                };

                return query;
            };

            // search through an array of hits and return the doc with the highest relevancy score
            var getHighScoreDoc = function (arr) {
                var maxVal = 0,
                    highScore_doc = null,
                    doc,
                    i;

                for (i = 0; i < arr.length; i++) {
                    doc = arr[i];
                    if (doc._score > maxVal) {
                        maxVal = arr._score;
                        highScore_doc = doc;
                    }
                }

                return highScore_doc;
            };

            // get the data from parsed VA medication text file
            var data = Data.getData();
            $scope.data = data ? Data.getData().data : [];
            $scope.name = data ? Data.getData().firstName : 'Hello';

            // find the doc in rxterms with the highest relevancy
            // check for drug-drug interactions
            if ($scope.data.length >= 2) {
                var promises = $scope.data.map(function (k) {
                    return esService.search(createQuery(k.Medication, 'DEFAULT'));
                });

                $q.all(promises).then(function (res) {
                    console.log(res);
                    esData = res.map(function(doc) {
                        return getHighScoreDoc(doc.hits.hits);
                    });

                    $timeout(function () {
                        // angular $timeout will run $apply() after, thus updating the scope
                        $scope.esData = esData;
                        var cb = function () {
                            $scope.ddiDetected = true;
                        };

                        InteractionAPI.getInteractions(esData)
                            .success(function (data) {
                                console.log(data);
                                DrugInteraction.format(data);
                                cb();
                            })
                            .error(function(data, status) {
                                console.log('err_data:', data);
                                console.log('err_status:', status);
                            });

                    });
                });
            }

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
            var data = Data.getData();
            $scope.schedule = data ? data.schedule : [];
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
            $scope.esResults = [];
            $scope.isResults = false;
            $scope.selected_idx = 0;

            // query creator for partial matching on multiple fields
            var createQuery = function (queryString) {
                var q_obj = {
                    "size": 5,
                    "body": {
                        "query": {
                            "multi_match": {
                                "query": queryString,
                                "type": "phrase_prefix",
                                "fields": ["FULL_NAME", "FULL_GENERIC_NAME", "BRAND_NAME", "DISPLAY_NAME", "DISPLAY_NAME_SYNONYM"]
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
                    $scope.error = new Error('Unable to connect to elasticsearch.' +
                        'Make sure that it is running and listening at http://localhost:9200');
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
                        if (err) throw (err);

                        $scope.esResults = res.hits.hits.map(function (i) {
                            return i._source;
                        });

                        $scope.isResults = $scope.esResults.length ? true : false;

                        return;
                    });
                } else { // hide the drop down
                    $scope.isResults = false;
                    return;
                }
            };
        });
})();









