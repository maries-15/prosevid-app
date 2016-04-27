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

		UtilitiesService.loadDataUser();
		UtilitiesService.loadSuccessListener();
		UtilitiesService.initBackButtonController();

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
				templateUrl: "templates/completeQuestion.html",
				controller: 'completeQuestionCtrl'
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
		console.log('Hi');
		$urlRouterProvider.otherwise('/login');
	}]);

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
	}]);


angular.module('login.controller', [])
	.controller('loginCtrl', ['$ionicLoading', '$localStorage', '$scope', '$state', 'configApp', 'sessionData', function($ionicLoading, $localStorage, $scope, $state, configApp, sessionData) {

		$scope.data = {};

		$scope.registerUser = function() {
			$ionicLoading.show({
				template: 'Autenticando...'
			});

			var ref = new Firebase(configApp.USERS);
			var refTrophies = new Firebase(configApp.TROPHIES);
			
			user = {
				email: 'anma2510@gmail.com',
				nombre: 'Andrea Marin',
				image: 'Alguna imagen',
				nivel: 1,
				key: 'anma2510',
				preguntasErroneas: 0,
				preguntasAcertadasT: 0,
				preguntasAcertadas: preguntasAcertadas,
				trophies:trophies
			};
			ref.child(user.key).set(user);
			refTrophies.child(user.key).set(trophies);

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

			window.plugins.googleplus.login({
					'offline': true,
				},
				function(obj) {
					console.log(JSON.stringify(obj));
					//verificar, si el usuario esta creado, de ser asi traerlo de la BD, de lo contrario guardar
					var key = obj.email.match(/^([^@]*)@/)[1];
					key = key.replace(/[.,#$]/g, '');
					var user;
					ref.child(key).once('value', function(snapshot) {

						if (snapshot.exists()) {
							user = snapshot.val();
						}
						else {
							user = {
								email: obj.email,
								nombre: obj.displayName,
								image: obj.imageUrl,
								nivel: 1,
								key: key,
								preguntasAcertadas: {
									incendios:0,
									evacuacion:0,
									primerosAuxilios:0
								},
								preguntasErroneas: 0,
								preguntasAcertadasT: 0
							};
							ref.child(user.key).set(user);
							refTrophies.child(user.key).set(trophies);
						}

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
		$rootScope.totalQuestios = sessionData.user.preguntasAcertadasT;
		$rootScope.answered = $localStorage.questionSession;
		var questionsLevel;
		var timerOut;
		var secondsTimer;


		if($localStorage.questionsLevel === undefined){
			questionsLevel = UtilitiesService.createNewArray($localStorage.Questions);
			$localStorage.questionsLevel = questionsLevel;
		}
		else{
			questionsLevel = $localStorage.questionsLevel;
		}

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
			startTimeOutCheck();

			if(Object.keys(questionsLevel).length === 0){
				questionsLevel = UtilitiesService.createNewArray($localStorage.Questions);
				$localStorage.questionsLevel = questionsLevel;
			}
		};

		var saveUser = function(){
			$rootScope.totalQuestios = sessionData.user.preguntasAcertadasT;
			var ref = new Firebase(configApp.USERS + "/"+ sessionData.user.key);
			ref.update(sessionData.user);
			$localStorage.user = sessionData.user;
		};

		var loadNextLevel = function(){
			//Update user level in database
			sessionData.user.nivel = sessionData.user.nivel + 1;
			saveUser();
			//Get questions of the next level
			var questionsRef = new Firebase(configApp.QUESTIONS);
			questionsRef.child('nivel' + sessionData.user.nivel).once('value', function(snapshot)
			{
				if (snapshot.exists()) {
					var questionsJson = snapshot.val();
					$localStorage.Questions = Object.keys(questionsJson).map(
						function(i) {
							return questionsJson[i];
						});
					questionsLevel = UtilitiesService.createNewArray($localStorage.Questions);
					$localStorage.questionsLevel = questionsLevel;
					$localStorage.questionSession = {
						acerts:0,
						fails:0
					};
					$rootScope.answered = $localStorage.questionSession;
				}
			});
		};

		var startTimeOutCheck = function(){
			var seconds = 20;
			$scope.seconds = 20;
			secondsTimer = setInterval(function(){
				$timeout(function(){
					seconds = seconds - 1;
					if(seconds > 9){
						$scope.seconds = seconds;
					}
					else{
						$scope.seconds = "0" + seconds;
					}
					if($scope.seconds === "00"){
						clearInterval(secondsTimer);
					}
				})
			}, 1000);

			timerOut = setTimeout(function() {
				setHeightBlockScreen($rootScope.height);
				alert("Mostrar time out");
				sessionData.user.preguntasErroneas = sessionData.user.preguntasErroneas + 1;
				saveUser();
				setTimeout(function() {
					setHeightBlockScreen(0);
					$rootScope.answered.fails = $rootScope.answered.fails + 1;
					jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
					$state.go('completeQuestion',{
						'navDirection':'forward'
					});
				}, 1500);
			}, 20000);
		};

		$scope.validateAnswer = function(answer, id) {
			stopTimer();
			clearTimeout(timerOut);
			clearInterval(secondsTimer);
			setHeightBlockScreen($rootScope.height);

			var acertQuestion = function(){
				sessionData.user.preguntasAcertadas[$scope.typeQuestion] = sessionData.user.preguntasAcertadas[$scope.typeQuestion] + 1;
				sessionData.user.preguntasAcertadasT = sessionData.user.preguntasAcertadasT + 1;
				saveUser();

				$rootScope.answered.acerts = $rootScope.answered.acerts + 1;
				efectAnsweredQuestion(true, id);
				jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
			};

			var failQuestion = function(){
				sessionData.user.preguntasErroneas = sessionData.user.preguntasErroneas + 1;
				saveUser();
				$rootScope.answered.fails = $rootScope.answered.fails + 1;
				efectAnsweredQuestion(false, id);
				jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
			};

			if (answer === $scope.data.opcionCorrecta) {
				acertQuestion();
				if($rootScope.answered.acerts === 6){
					setTimeout(function() {
						loadNextLevel();
						$state.go('passLevel', {
							'navDirection':'forward'
						});
					}, 3600);
					return;
				}
			} else {
				failQuestion();
			}
			setTimeout(function() {
				$state.go('completeQuestion', {
					'navDirection':'forward'
				});
			}, 3600);
		};

		$rootScope.loadNextQuestion = function(){
			loadQuestion();
		};
		loadQuestion();
	}]);

var firebaseRef = 'https://prosevid-app.firebaseio.com/';
var applicationConfig = {
	REF: firebaseRef,
	USERS: firebaseRef + '/users',
	QUESTIONS: firebaseRef + '/questions',
	TROPHIES:firebaseRef + '/trophies'
}

var preguntasAcertadas = {
	incendios:0,
	evacuacion:0,
	primerosAuxilios:0
};
var trophies = {
	bombero:{
		state:false
	},
	enfermero: {
		state:false
	}
};
var descriptionTrophies = {
	bombero:{
		description:"Responde correctamente 10 preguntas de incendios."
	},
	enfermero:{
		description:"Responde correctamente 20 preguntas de primeros auxilios."
	}
};


angular.module('services.questions', [])
	.constant('configApp', applicationConfig)
	.value('sessionData', {})
	.service('UtilitiesService',['$ionicHistory', '$ionicPlatform', '$localStorage', '$location', '$state', '$rootScope', 'sessionData', function($ionicHistory, $ionicPlatform, $localStorage, $location, $state, $rootScope, sessionData) {
		var services = {};
		var statesLetButtonBack = ['menuMore', 'ranking', 'trophies'];

		services.createNewArray = function(array){
			var newArray = [];
			for(var i = 0; i < array.length; i++){
				newArray.push(array[i]);
			}
			return newArray;
		};

		services.loadDataUser = function(){
			if($localStorage.user){
				sessionData.user = $localStorage.user;
				//$location.path('/menu');
			}
			if($localStorage.questionSession === undefined){
				$localStorage.questionSession = {
					acerts:0,
					fails:0
				};
			}
		};

		services.loadSuccessListener = function(){
			$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams)
			{
				if ($rootScope.height === undefined) {
					$rootScope.height = jQuery('ion-nav-view').height();
				}
			});
		};

		services.initBackButtonController = function(){
			$ionicPlatform.registerBackButtonAction(function(e) {

				if (statesLetButtonBack.indexOf($state.current.name) !== -1) {
					$ionicHistory.goBack();
				} else if ($rootScope.backButtonPressedOnceToExit) {
					ionic.Platform.exitApp();
				} else if ($state.current.name === 'menu') {
					$rootScope.backButtonPressedOnceToExit = true;
					//Mensaje presiona de nuevo para salir
					setTimeout(function() {
						$rootScope.backButtonPressedOnceToExit = false;
					}, 2000);
				}
				e.preventDefault();
				return false;
			}, 101);
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
	timerSeconds = 20;
	timerFinish = new Date().getTime()+(timerSeconds*1000);
	drawTimer(100);
	timer = setInterval('stopWatch()',50);
}

function stopTimer(){
	clearInterval(timer);
}


var colorsWrong = ['#FF9800','#FFF','#FF9800','#FFF','#FF0000'];
var colorCorrect = ['#FF9800','#FFF','#FF9800','#FFF','#60FF00'];

function efectAnsweredQuestion(correct, id){
    var colors = colorCorrect;
    if(correct === false){
        colors = colorsWrong;
    }
    jQuery('#'+id).css('background',colors[0]);
    var cont = 1;
    var a = setInterval(function(){
        jQuery('#'+id).css('background',colors[cont]);
        cont++;
        if(cont === 6){
            clearInterval();
            setTimeout(function() {
                jQuery('#'+id).css('background','#EDEEF0');
                jQuery('#blockScreen').css('height', 0);
            }, 1500);
        }
    }, 500)
}

function setHeightBlockScreen(height){
    jQuery('#blockScreen').css('height',height);
}

angular.module('starter.controllers')
.controller('trophiesCtrl', ['$ionicLoading', '$scope', '$rootScope', '$timeout', 'configApp', 'sessionData', function($ionicLoading, $scope, $rootScope, $timeout, configApp, sessionData) {
        
        $rootScope.reloadTrophies = function(){
           var ref = new Firebase(configApp.TROPHIES);
            ref.child(sessionData.user.key).once('value', function(snapshot){
                if(snapshot.val()){
                    $timeout(function(){
                        $scope.trophies = {};
                        $.extend(true, $scope.trophies, snapshot.val(), descriptionTrophies);
                        console.log($scope.trophies);
                    });
                }
            });
        };
        $rootScope.reloadTrophies();
    }]);