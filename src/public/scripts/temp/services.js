/**
 * Created by eunicekim on 7/1/15.
 */
(function () {
  angular.module('DrugInteractionService', []);
  angular.module('DrugInteractionService').service('DrugInteraction', [function () {
      var interactions = [];
      var drugPair = [];
      var Type = function (description, drugs) {
        this.description = description;
        this.drugs = drugs;
      };
      var Drug = function (name, url) {
        this.name = name;
        this.url = url;
      };
      function findJson(o, term) {
        var k, l;
        if (angular.isObject(o)) {
          for (var key in o) {
            if (o.hasOwnProperty(key)) {
              k = o[key];
              if (key === term) {
                console.log(k);
                break;
                return k;
              }
              if (angular.isObject(k)) {
                findJson(k, term);
              } else if (angular.isArray(k)) {
                for (var i = 0; i < k.length; i++) {
                  l = k[i];
                  if (angular.isObject(l)) {
                    findJson(l, term);
                  }
                }
              }
            }
          }
        }
        k ? k : false;
        return k;
      }
      return {
        format: function (data) {
          var terms = [
              'fullInteractionType',
              'interactionPair',
              'description',
              'interactionConcept',
              'sourceConceptItem',
              'name'
            ];
          var test = findJson(data, 'fullInteractionType');
          console.log('test', test);
          return test;
        }
      };
    }]);
}());(function () {
  angular.module('pillboxApp.factory', []);
  // Data to share between controllers
  angular.module('pillboxApp.factory').factory('Data', function () {
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
  // Handles data from medlist db
  angular.module('pillboxApp.factory').factory('MedList', [
    '$http',
    '$q',
    function ($http, $q) {
      var MedList = function (data) {
        angular.extend(this, data);
      };
      // a static method to retrieve entire MedList
      MedList.get = function () {
        var deferred = $q.defer();
        $http.get('/rxterms').success(function (res) {
          deferred.resolve(res);
        }).error(function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      };
      return MedList;
    }
  ]);
  // Handles API calls to Drug Interaction RESTful API
  angular.module('pillboxApp.factory').factory('InteractionAPI', [
    '$http',
    function ($http) {
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
      };
    }
  ]);
}());(function () {
  angular.module('pillboxApp.service', []);
  angular.module('pillboxApp.service').service('fileUpload', [
    '$http',
    function ($http) {
      this.uploadFileToUrl = function (file, uploadUrl) {
        console.log(file);
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        }).success(function (d) {
          console.log('Success! Data was sent to server!');
        }).error(function (error) {
          console.error('Error! Something went wrong when sending data to server!', error);
        });
      };
    }
  ]);
  // esFactory() creates a configured client instance. Turn that instance
  // into a service so that it can be required by other parts of the application
  angular.module('pillboxApp.service').service('esService', [
    'esFactory',
    function (esFactory) {
      return esFactory({
        host: 'localhost:9200',
        apiVersion: '1.6',
        log: 'trace'
      });
    }
  ]);
}());