// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'firebase',
  'ngStorage',
  'questions.controllers',
  'login.controller',
  'services.questions'
  ])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      $stateProvider
      .state('login', {
        url:'/login',
        templateUrl: "templates/login.html",
        controller: 'loginCtrl'
      })
      .state('menu', {
        url:'/menu',
        templateUrl: "templates/menu.html",
      })
      .state('questions', {
        url:'/questions',
        templateUrl: "templates/questions.html",
        controller: 'questionsCtrl'
      })
      .state('menuMore', {
        url:'/menuMore',
        templateUrl: "templates/menuMore.html",
      })
      .state('ranking', {
        url:'/ranking',
        templateUrl: "templates/ranking.html",
        controller: 'rankingCtrl'
      })
      .state('trophies', {
        url:'/trophies',
        templateUrl: "templates/trophies.html",
        controller: 'trophiesCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  }]);

angular.module('questions.controllers', [])
	.controller('questionsCtrl', ['$scope', function($scope) {
		console.log('this');
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
			$scope.data.tipo = 'evacuación';
    		ref.push($scope.data);
    		$ionicLoading.show({
		    	template: 'Se guardo exitosamente',
		    	duration: 750
		    });
		    $scope.data = {};
		    $scope.metadata = {};
		};
	}]);


angular.module('login.controller', [])
	.controller('loginCtrl', ['$ionicLoading', '$localStorage', '$scope', '$state', 'configApp', 'sessionData', function($ionicLoading, $localStorage, $scope, $state, configApp, sessionData) {

		$scope.data = {};

		$scope.registerUser = function() {
			$ionicLoading.show({
		    	template: 'Autenticando...'
		    });
			var ref = new Firebase(configApp.USERS);
			window.plugins.googleplus.login({
					'offline': true,
				},
				function(obj) {
					console.log(JSON.stringify(obj));

					var user = {
						email: obj.email,
						nombre: obj.displayName,
						image: obj.imageUrl,
						nivel: 1
					};
					var key = user.email.match(/^([^@]*)@/)[1];
					//verificar, si el usuario esta creado, de ser asi traerlo de la BD, de lo contrario guardar
					ref.child(key).once('value', function(snapshot) {
						if (snapshot.exists()) {
							user = snapshot.val();
							sessionData.user = user;
							$localStorage.user = user;

							var questionsRef = new Firebase(configApp.QUESTIONS);
							questionsRef.child('nivel' + user.nivel).once('value', function(snapshotQ) {
								if (snapshotQ.exists()) {
									questionsLevel = snapshotQ.val();
									$localStorage.Questions = questionsLevel;
									console.log($localStorage);
									$ionicLoading.hide();
									$state.go('menu');
								}
							});
						}
					});
				},
				function(msg) {
					console.log('error: ', msg);
				}
			);
		};
	}]);

var firebaseRef = 'https://prosevid-app.firebaseio.com/';
var applicationConfig = {
	REF: firebaseRef,
	USERS: firebaseRef + '/users',
	QUESTIONS: firebaseRef + '/questions'
}

angular.module('services.questions', [])
	.constant('configApp', applicationConfig)
	.value('sessionData', {})
	.value('questionsLevel', {});
