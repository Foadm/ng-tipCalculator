/**
 * Created by mozafff on 10/9/2014.
 */

angular.module('tipCalculator', ['ngRoute'])
    .config(function($routeProvider){
        $routeProvider.when('/', {
            templateUrl : './home.html'
        })
            .when('/new-meal', {
                templateUrl : './meal.html',
                controller : 'InputCtrl'
            })
            .when('/my-earnings', {
                templateUrl : './earning.html',
                controller : 'DisplayDataCtrl'
            });
    })
    .controller('InputCtrl',function($scope,$rootScope){
        // this function resets app to initial state
        $scope.init = function(){
            $scope.price = null;
            $scope.taxRate = null;
            $scope.tipPercentage = null;
            $scope.sendData($scope.customer,$scope.server);
        };
        $scope.customer = {
            subtotal : 0,
            tip : 0,
            total :0
        };
        $scope.server = {
            mealCount : 0,
            tipTotal : 0,
            average : 0
        };
        //would be better if the following logic is not inside the submit?
        //would it be better to use $watch in this case?
        $scope.submit = function(){
            $scope.customer.subtotal = $scope.price + ($scope.price * $scope.taxRate) / 100;
            $scope.customer.tip = ($scope.price * $scope.tipPercentage) / 100;
            $scope.customer.total = $scope.customer.subtotal + $scope.customer.tip;
            //server section
            $scope.server.mealCount = $scope.server.mealCount + 1;
            $scope.server.tipTotal = $scope.customer.tip + $scope.server.tipTotal;
            $scope.server.average = $scope.server.average + ($scope.server.tipTotal / $scope.server.mealCount);
            //broadcast : should these be seperated into two broadcast calls for each controller?

            $scope.sendData($scope.server);
            $scope.test= true;
        };
        $scope.sendData = function(serverData){
            $rootScope.$broadcast('newData',serverData);
        };
        $scope.init();
    })
    .controller('DisplayDataCtrl',function($scope){
        $scope.$on('newData', function(event,serverData){
            console.log('broadcast called');
            $scope.mealCount = serverData.mealCount;
            $scope.tipTotal = serverData.tipTotal;
            $scope.average = serverData.average;
        });
    })

