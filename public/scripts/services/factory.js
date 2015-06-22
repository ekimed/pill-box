// Data to share between controllers
angular.module('pillboxApp')
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
angular.module('pillboxApp')
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