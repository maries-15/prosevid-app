angular.module('starter.controllers', [])
	.controller('completeQuestionCtrl',['$rootScope', function($rootScope){
		jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
	}])
	.controller('rankingCtrl', ['$scope', function($scope) {
		$scope.usersRanking = [];
		for (var i = 0; i < 8; i++) {
			var user = {
				'name': 'user-' + i,
				'id': i
			};
			$scope.usersRanking.push(user);
		}
	}])
	.controller('trophiesCtrl', ['$ionicLoading', '$scope', 'configApp', function($ionicLoading, $scope, configApp) {
		$scope.list = [];
		$scope.data = {
			opciones:{}
		};
		$scope.metadata = {};
		for (var i = 2; i <= 20; i++) {
			$scope.list.push(i);
		}

		$scope.saveQuestion = function(){
			var ref = new Firebase(configApp.QUESTIONS).child('nivel'+$scope.metadata.nivel);
			$scope.data.tipo = 'incendios';
    		ref.push($scope.data);
    		$ionicLoading.show({
		    	template: 'Se guardo exitosamente',
		    	duration: 750
		    });
		    $scope.data = {};
		    $scope.metadata = {};
		};
	}]);

