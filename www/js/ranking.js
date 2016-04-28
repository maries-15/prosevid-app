angular.module('starter.controllers')
.controller('rankingCtrl', ['$firebaseArray', '$scope', '$rootScope', 'configApp', 'sessionData', function($firebaseArray, $scope, $rootScope, configApp, sessionData) {
        $scope.usersRanking = {};

        $rootScope.reloadRanking = function(){
            var list = $firebaseArray(new Firebase(configApp.USERS));
            list.$loaded(function(){
                var orderList = list.sort(sortUserRanking);
                $scope.currentUser = sessionData.user;
                $scope.currentUser.position = orderList.findIndex(findUser);
                $scope.usersRanking = orderList.splice(0, 5);
                orderList.$destroy();
                orderList = null;
            });
        };

        var sortUserRanking = function(a, b) {
            var compareCorrect = a.preguntasAcertadasT - b.preguntasAcertadasT;
            var compareIncorrect = a.preguntasErroneas - b.preguntasErroneas;

            if (compareCorrect > 0) {
                return -1;
            }
            else if (compareCorrect < 0) {
                return 1;
            }
            else {
                if(compareIncorrect > 0){
                    return 1;
                }
                else if(compareIncorrect < 0){
                    return -1;
                }
                else{
                    return 0;
                }
            }
        };

        var findUser = function(element){
            return element.key == sessionData.user.key;
        };

        $rootScope.reloadRanking();
    }]);