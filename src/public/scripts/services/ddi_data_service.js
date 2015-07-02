/**
 * Created by eunicekim on 7/1/15.
 */

(function () {
    angular.module('DrugInteractionService', []);

    angular.module('DrugInteractionService')
        .service('DrugInteraction', [function () {
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

            function findJson (o, term) {
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

                    var test = findJson(data, 'fullInteractionType'); console.log('test', test);
                    return test;
                }
            }
        }]);

})();