
(function () {
    angular.module('pillboxApp.factory', []);

    // Data to share between controllers
    angular.module('pillboxApp.factory')
        .factory('Data', function() {
            var factory = {};
            var data;
            factory.setData = function(dataToSet) {
                data = dataToSet;
                return data;
            };

            factory.getData = function() {
                return data;
            };

            return factory;
        });

    // Handles data from medlist db
    angular.module('pillboxApp.factory')
        .factory('MedList', function ($http, $q) {
            var MedList = function (data) {
                angular.extend(this, data);
            };

            // a static method to retrieve entire MedList
            MedList.get = function () {
                var deferred = $q.defer();
                $http.get('/rxterms')
                    .success(function (res) {
                        deferred.resolve(res);
                    })
                    .error(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;

            };

            return MedList;
        });

    // Handles API calls to Drug Interaction RESTful API
    angular.module('pillboxApp.factory')
        .factory('InteractionAPI', ['$http', function ($http) {
            var rxcuis = [];
            var baseUrl = 'http://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=';
            var createQueryStr = function (arr) {
                return arr.join('+');
            };
            var createUrl = function (arr) {
                return baseUrl + createQueryStr(arr);
            };

            var makeRequest = function (arr) {
                var url = createUrl(arr);
                return $http.get(url);
            };

            var getRxcuis = function (arr) {
                arr.forEach(function (k) {
                    rxcuis.push(k['_source']['RXCUI']);
                });

                return rxcuis;
            };

            return {
                getInteractions: function (arr) {
                    var rxcui = getRxcuis(arr);
                    return makeRequest(rxcui);
                }
            }
        }]);
})();


