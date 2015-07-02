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

            function traverse (obj, fn) {
                var val, check, val2;
                var isObject = function (o) {
                    if (o instanceof Object && !(o instanceof Array)) {
                        return true;
                    }

                    return false;
                };

                for (var key in obj) {
                    val = obj[key];
                    fn.apply(this, [key, val]);
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

            function getProp (obj, prop) {
                var results = [];
                traverse(obj, function (key, val) {
                    if (key === prop) {
                        results.push(val);
                    }
                });

                return results;
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

                    var fullIntType = this.find(data, terms[0]); console.log(fullIntType);
                },
                find: function (data, term) {
                    var res = getProp(data, term);
                    return res;
                }
            }
        }]);

})();