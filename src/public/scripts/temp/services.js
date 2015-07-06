/**
 * Created by eunicekim on 7/1/15.
 */
(function () {
  angular.module('DrugInteractionService', []);
  angular.module('DrugInteractionService').service('DrugInteraction', [function () {
      var interactions = [];
      var drugPair = [];
      var _drugList = [];
      var Schema = function (description, drug1, drug2) {
        this.description = description;
        this.drug_a = drug1;
        this.drug_b = drug2;
      };
      function isObject(o) {
        if (o instanceof Object && !(o instanceof Array)) {
          return true;
        }
        return false;
      }
      function isFunction(fn) {
        return !!(fn && fn.constructor && fn.call && fn.apply);
      }
      function traverse(obj, fn) {
        var val, check, val2;
        for (var key in obj) {
          val = obj[key];
          fn.apply(this, [
            key,
            val
          ]);
          check = isObject(val);
          if (check) {
            traverse(val, fn);
          } else if (val instanceof Array) {
            for (var i = 0; i < val.length; i++) {
              val2 = val[i];
              check = isObject(val2);
              if (check) {
                traverse(val2, fn);
              }
            }
          }
        }
      }
      function getProp(obj, prop) {
        var results = [];
        traverse(obj, function (key, val) {
          if (key === prop) {
            results.push(val);
          }
        });
        return results;
      }
      function _flatten(data) {
        var arr = [];
        function fn(array) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].constructor !== Array) {
              arr.push(array[i]);
            } else if (array[i].constructor === Array) {
              fn(array[i]);
            }
          }
        }
        fn(data);
        return arr;
      }
      // TODO filter array only unique objects
      return {
        format: function (data) {
          var res = [];
          var terms = [
              'fullInteractionType',
              'interactionPair',
              'description',
              'interactionConcept',
              'sourceConceptItem',
              'name'
            ];
          var tmp;
          interactions = this.find(data, terms[0])[0];
          // should return an array
          interactions.forEach(function (type) {
            tmp = getProp(type, terms[1]);
            drugPair = drugPair.concat(_flatten(tmp));
          });
          drugPair.forEach(function (drug) {
            var a, b;
            _drugList = drug['interactionConcept'];
            _drugList.forEach(function (concept) {
              if (a) {
                b = concept['sourceConceptItem'].name;
              } else {
                a = concept['sourceConceptItem'].name;
              }
            });
            var _drug = new Schema(drug.description, a, b);
            res.push(_drug);
          });
          return res;
        },
        find: function (data, term) {
          var res = getProp(data, term);
          return res;
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