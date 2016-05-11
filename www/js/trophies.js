angular.module('starter.controllers')
.controller('trophiesCtrl', ['$ionicLoading', '$scope', '$rootScope', '$timeout', 'configApp', 'sessionData', function($ionicLoading, $scope, $rootScope, $timeout, configApp, sessionData) {

        $rootScope.reloadTrophies = function(){
           var ref = new Firebase(configApp.TROPHIES);
            ref.child(sessionData.user.key).once('value', function(snapshot){
                if(snapshot.val()){
                    $timeout(function(){
                        $scope.trophies = {};
                        $.extend(true, $scope.trophies, snapshot.val(), descriptionTrophies);
                    });
                }
            });
        };
        $rootScope.reloadTrophies();
    }]);
