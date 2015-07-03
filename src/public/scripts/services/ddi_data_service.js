/**
 * Created by eunicekim on 7/1/15.
 */

(function () {
    angular.module('DrugInteractionService', []);

    angular.module('DrugInteractionService')
        .service('DrugInteraction', [function () {
            var interactions = [];
            var drugPair = [];
            var _drugList = [];
            var Schema = function (description, drug1, drug2) {
                this.description = description;
                this.drug_a = drug1;
                this.drug_b = drug2;
            };

            function isObject (o) {
                if (o instanceof Object && !(o instanceof Array)) {
                    return true;
                }

                return false;
            }

            function isFunction (fn) {
                return !!(fn && fn.constructor && fn.call && fn.apply);
            }

            function traverse (obj, fn) {
                var val, check, val2;

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

            function _flatten (data) {
                var arr = [];
                function fn (array) {
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

                    interactions = this.find(data, terms[0])[0]; // should return an array

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
            }
        }]);

})();