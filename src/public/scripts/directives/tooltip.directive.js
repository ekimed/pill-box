/**
 * Created by eunicekim on 6/25/15.
 */

//(function () {
//    angular.module('pillboxApp')
//        .directive('pbTooltip', ['$document', function($document) {
//            return {
//                restrict: 'EA',
//                link: function (scope, element, attrs) {
//                    // DOM behavior
//                    scope.isVisible = function (shouldShow) {
//                        scope.visibility = shouldShow;
//                    };
//
//                    console.log(attrs);
//                },
//                scope: {
//                    tooltipMsg: '='
//                },
//                template: '<span>{{tooltipMsg}}</span>'
//            }
//        }]);
//})();

(function () {
    angular.module('pillboxApp')
        .directive('pbTooltip',['$document', function ($document) {
            return {
                restrict: 'EA',
                transclude: true,
                scope: {
                   tooltipMsg: '='
                },
                link: function (scope, element, attrs) {
                    console.log('The link fn was called');
                    element.css({
                        position: 'relative'
                    });

                    scope.show = function () {
                        scope.shouldshow = true;
                    };

                    scope.hide = function () {
                        scope.shouldshow = false;
                    }
                },
                template: '<span ng-show="shouldshow" class="pb-tooltip">{{tooltipMsg}}</span><div ng-transclude ng-mouseenter="show()" ng-mouseleave="hide()"></div>'
            }
        }])
})();


//(function () {
//    angular.module('pillboxApp')
//        .directive('pbTooltip',['$document', function ($document) {
//            return {
//                restrict: 'EA',
//                transclude: true,
//                scope: {
//                    tooltipMsg: '='
//                },
//                link: function (scope, element, attrs) {
//                    console.log('The link fn was called');
//                    element.css({
//                        position: 'relative'
//                    })
//
//                },
//                template: '<span class="pb-tooltip">{{tooltipMsg}}</span><div ng-transclude></div>'
//            }
//        }])
//})();