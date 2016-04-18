// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
	'ionic',
	'firebase',
	'ngStorage',
	'starter.controllers',
	'questions.controllers',
	'login.controller',
	'services.questions'
	])

.run(['$ionicPlatform', 'UtilitiesService', function($ionicPlatform, UtilitiesService) {
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

		UtilitiesService.loadUser();
	}])
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
			.state('completeQuestion', {
				url:'/completeQuestion',
				templateUrl: "templates/completeQuestion.html"
			})
			.state('passLevel', {
				url:'/passLevel',
				templateUrl: "templates/passLevel.html"
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

angular.module('starter.controllers', [])
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


angular.module('login.controller', [])
	.controller('loginCtrl', ['$ionicLoading', '$localStorage', '$scope', '$state', 'configApp', 'sessionData', function($ionicLoading, $localStorage, $scope, $state, configApp, sessionData) {

		$scope.data = {};

		$scope.registerUser = function() {
			$ionicLoading.show({
				template: 'Autenticando...'
			});

			/**var ref = new Firebase(configApp.USERS);
			ref.child('anma2510').once('value', function(snapshot) {
				if (snapshot.exists()) {
					user = snapshot.val();
					user.key = snapshot.key();
					sessionData.user = user;
					$localStorage.user = user;

					var questionsRef = new Firebase(configApp.QUESTIONS);
					console.log(user.nivel);
					questionsRef.child('nivel' + user.nivel).once('value', function(snapshotQ) {
						if (snapshotQ.exists()) {
							var questionsJson = snapshotQ.val();
							$localStorage.Questions = Object.keys(questionsJson).map(
								function(i) {
									return questionsJson[i];
								});
							$ionicLoading.hide();
							$state.go('menu');
						}
					});
				}
			});**/

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
						nivel: 1,
						key: obj.email.match(/^([^@]*)@/)[1]
					};
					
					//verificar, si el usuario esta creado, de ser asi traerlo de la BD, de lo contrario guardar
					ref.child(user.key).once('value', function(snapshot) {
						if (snapshot.exists()) {
							user = snapshot.val();
							user.key = snapshot.key();
							sessionData.user = user;
							$localStorage.user = user;

							var questionsRef = new Firebase(configApp.QUESTIONS);
							questionsRef.child('nivel' + user.nivel).once('value', function(snapshotQ) {
								if (snapshotQ.exists()) {
									var questionsJson = snapshotQ.val();
									$localStorage.Questions = Object.keys(questionsJson).map(
										function(i) {
											return questionsJson[i];
										});
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

angular.module('questions.controllers', [])
	.controller('questionsCtrl', ['$scope', '$localStorage', '$state', '$rootScope', '$timeout', 'configApp', 'sessionData', 'UtilitiesService', 
		function($scope, $localStorage, $state, $rootScope, $timeout, configApp, sessionData, UtilitiesService) {


		$scope.data = {};
		$scope.typeQuestion = "incendios";
		var acertadas = 0;
		var fallidas = 0;

		var questionsLevel = UtilitiesService.createNewArray($localStorage.Questions);

		var loadQuestion = function() {
			var questionRandom = parseInt(Math.random() * questionsLevel.length);
			$scope.data = questionsLevel[questionRandom];
			questionsLevel.splice(questionRandom, 1);
				
			if($scope.data.tipo == "incendios"){
				$scope.typeQuestion = "incendios";
			} 
			else if ($scope.data.tipo == "evacuación") {
				$scope.typeQuestion = "evacuacion";
			} else {
				$scope.typeQuestion = "primerosAuxilios";
			}
			startTimer();
		};

		var loadNextLevel = function(){
			//Update user level in database
			var ref = new Firebase(configApp.USERS + "/"+ sessionData.user.key);
			sessionData.user.nivel = sessionData.user.nivel + 1;
			ref.update({nivel: sessionData.user.nivel});
			$localStorage.user = sessionData.user;

			//Get questions of the next level
			var questionsRef = new Firebase(configApp.QUESTIONS);
			questionsRef.child('nivel' + sessionData.user.nivel).once('value', function(snapshot) {
				if (snapshot.exists()) {
					var questionsJson = snapshot.val();
					$localStorage.Questions = Object.keys(questionsJson).map(
						function(i) {
							return questionsJson[i];
						});
					questionsLevel = UtilitiesService.createNewArray($localStorage.Questions);
					console.log(questionsLevel.length);
					acertadas = 0;
					fallidas = 0;
					$timeout(loadQuestion());
				}
			});
		};

		$scope.validateAnswer = function(answer) {
			stopTimer();
			if (answer === $scope.data.opcionCorrecta) {
				acertadas++;
				alert("Has acertado");
				if(acertadas === 2){
					loadNextLevel();
					$state.go('passLevel');
					return;
				}
			} else {
				fallidas++;
				alert("Has fallado");
				if(fallidas === 3){
					//Reiniciar Nivel
					alert("perdio impedido");
				}
			}
			$state.go('completeQuestion');
		};

		$scope.$on('loadQuestion', function(event, response) {
			loadQuestion();
		});

		$rootScope.loadNextQuestion = function(){
			loadQuestion();
		};
		loadQuestion();
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
	.service('UtilitiesService',['$localStorage', '$rootScope', 'sessionData', function($localStorage, $rootScope, sessionData) {
		var services = {};

		services.createNewArray = function(array){
			var newArray = [];
			for(var i = 0; i < array.length; i++){
				newArray.push(array[i]);
			}
			return newArray;
		};

		services.loadUser = function(){
			if($localStorage.user){
				sessionData.user = $localStorage.user;
			};
		};

		return services;
	}]);

var timerCurrent;
var timerSeconds;
var timerFinish;
var timer;

function drawTimer(percent){
    jQuery('#timer').html('<div class="percent"></div><div id="slice"'+(percent > 50?' class="gt50"':'')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
    var deg = 360/100*percent;
    jQuery('#slice .pie').css({
        '-moz-transform':'rotate('+deg+'deg)',
        '-webkit-transform':'rotate('+deg+'deg)',
        '-o-transform':'rotate('+deg+'deg)',
        'transform':'rotate('+deg+'deg)'
    });
    jQuery('.percent').html(Math.round(percent)+'%');
}

function stopWatch(){
    var seconds = (timerFinish-(new Date().getTime()))/1000;
    if(seconds <= 0){
        drawTimer(100);
        clearInterval(timer);
    }else{
        var percent = 100-((seconds/timerSeconds)*100);
        drawTimer(percent);
    }
}

function startTimer(){
	timerCurrent = 0;
	timerSeconds = 30;
	timerFinish = new Date().getTime()+(timerSeconds*1000);
	drawTimer(100);
	timer = setInterval('stopWatch()',50);
}

function stopTimer(){
	clearInterval(timer);
}