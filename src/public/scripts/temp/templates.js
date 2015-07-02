angular.module('templates-main', ['server/views/modal/templates/ddi_template.jade']);

angular.module("server/views/modal/templates/ddi_template.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("server/views/modal/templates/ddi_template.jade",
    "<div class=\"ngdialog-message\"><p>this is a test</p></div>");
}]);
