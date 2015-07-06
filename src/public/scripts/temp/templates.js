angular.module('templates-main', ['server/views/modal/templates/ddi_template.jade']);

angular.module("server/views/modal/templates/ddi_template.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("server/views/modal/templates/ddi_template.jade",
    "<div ng-model=\"ddiData\" class=\"ngdialog-message\"><h2>{{ddiLen}} Drug Interaction Pairs Found</h2><div ng-repeat=\"d in ddiData\" class=\"ddi-item\"><div>{{d.drug_a}} + {{d.drug_b}} <i class=\"fa fa-long-arrow-right ddi-arrow\"></i> <i class=\"fa fa-exclamation-triangle ddi-warn\"></i> {{d.description}}</div></div></div>");
}]);
