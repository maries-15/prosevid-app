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
		$urlRouterProvider.otherwise('/login');
	}]);

angular.module('starter.controllers', [])
	.controller('completeQuestionCtrl',['$rootScope', function($rootScope){
		jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
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
    a_bomberito:{
        state:false
    },
    b_bombero:{
        state:false
    },
    c_capitan:{
        state:false
    },
    d_cadete:{
        state:false
    },
    e_rescatista:{
        state:false
    },
    f_brigadista:{
        state:false
    },
    g_enfermerito:{
        state:false
    },
    h_enfermero:{
        state:false
    },
    i_jefe:{
        state:false
    },
    j_estudiante:{
        state:false
    },
    k_maestro:{
        state:false
    },
    l_experto:{
        state:false
    }
};
var descriptionTrophies = {
    a_bomberito:{
        description:"Responde correctamente 8 preguntas de incendios."
    },
    b_bombero:{
        description:"Responde correctamente 15 preguntas de incendios."
    },
    c_capitan:{
        description:"Responde correctamente 25 preguntas de incendios."
    },
    d_cadete:{
        description:"Responde correctamente 8 preguntas de evacuación."
    },
    e_rescatista:{
        description:"Responde correctamente 15 preguntas de evacuación."
    },
    f_brigadista:{
        description:"Responde correctamente 25 preguntas de evacuación."
    },
    g_enfermerito:{
        description:"Responde correctamente 15 preguntas de primeros auxilios."
    },
    h_enfermero:{
        description:"Responde correctamente 25 preguntas de primeros auxilios."
    },
    i_jefe:{
        description:"Responde correctamente 40 preguntas de primeros auxilios."
    },
    j_estudiante:{
        description:"Consigue 50 cruces."
    },
    k_maestro:{
        description:"Consigue 80 cruces."
    },
    l_experto:{
        description:"Consigue 120 cruces."
    }
};
angular.module('login.controller', [])
	.controller('loginCtrl', ['$ionicLoading', '$localStorage', '$scope', '$state', '$rootScope', 'Auth', 'configApp', 'sessionData', function($ionicLoading, $localStorage, $scope, $state, $rootScope, Auth, configApp, sessionData) {

			$scope.data = {};

			var successLogin = function(userData) {
				var user;
				var ref = new Firebase(configApp.USERS);
				var refTrophies = new Firebase(configApp.TROPHIES);
				ref.child(userData.key).once('value', function(snapshot) {

					if (snapshot.exists()) {
						user = snapshot.val();
					} else {
						user = {
							email: userData.email,
							nombre: userData.nombre,
							image: userData.image,
							nivel: 1,
							key: userData.key,
							preguntasAcertadas: {
								incendios: 0,
								evacuacion: 0,
								primerosAuxilios: 0
							},
							preguntasErroneas: 0,
							preguntasAcertadasT: 0
						};
						ref.child(user.key).set(user);
						refTrophies.child(user.key).set(trophies);
					}

					sessionData.user = user;
					$rootScope.user = sessionData.user;
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
			};

			$scope.registerUser = function() {
				$ionicLoading.show({
					template: 'Autenticando...'
				});

				try {
					window.plugins.googleplus.login({
							'offline': true,
						},
						function(obj) {
							var key = obj.email.match(/^([^@]*)@/)[1];
							key = key.replace(/[.,#$]/g, '');

							var userData = {
								email: obj.email,
								nombre: obj.displayName,
								image: obj.imageUrl,
								key: key
							};

							successLogin(userData);
						},
						function(msg) {
							console.log(msg);
						}
					);
				} catch (e) {
					if (e instanceof TypeError) {
						Auth.$authWithOAuthPopup('google', {
							scope: 'email'
						}).then(function(authData) {
							if (authData !== null) {
								var provider = authData.provider;
								var key = authData[provider].email.match(/^([^@]*)@/)[1];
								key = key.replace(/[.,#$]/g, '');

								var userData = {
									email: authData[provider].email,
									nombre: authData[provider].displayName,
									image: authData[provider].profileImageURL,
									key: key
								};
								successLogin(userData);
							}
						})
					} else {
						//Mensaje, este dispositivo no es compatible con esta aplicacion
					}
				}
			};
	}]);

angular.module('starter')
	.service('mediaService', ['$rootScope', function($rootScope) {

		var services = {};

		var media;
		var path = '/android_asset/www/sources/';
		var routes = ['timer.mp3','win.mp3','fail.mp3'];

		services.playShot = function(position) {
			if(typeof Media !== 'undefined'){
				media = new Media(path + routes[position], function() {
					media.release();
				}, function(error) {
					console.log('error', media.src, error);
				});
				media.play();
			}
		};

		services.pauseShot = function() {
			if(typeof Media !== 'undefined'){
				media.pause();
			}
		};

		services.stopShot = function() {
			if(typeof Media !== 'undefined'){
				media.stop();
				media.release();
			}
		};

		return services;
	}]);

angular.module('questions.controllers', [])
	.controller('questionsCtrl', ['$scope', '$localStorage', '$state', '$rootScope', '$timeout', 'configApp', 'mediaService', 'sessionData', 'UtilitiesService',
		function($scope, $localStorage, $state, $rootScope, $timeout, configApp, mediaService, sessionData, UtilitiesService) {

		$scope.data = {};
		$scope.typeQuestion = "incendios";
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
			mediaService.playShot(0);
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
				mediaService.playShot(2);
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
			mediaService.stopShot();
			clearTimeout(timerOut);
			clearInterval(secondsTimer);
			setHeightBlockScreen($rootScope.height);

			var acertQuestion = function(){
				sessionData.user.preguntasAcertadas[$scope.typeQuestion] = sessionData.user.preguntasAcertadas[$scope.typeQuestion] + 1;
				sessionData.user.preguntasAcertadasT = sessionData.user.preguntasAcertadasT + 1;
				saveUser();

				$rootScope.answered.acerts = $rootScope.answered.acerts + 1;
				efectAnsweredQuestion(true, id);
				setTimeout(function() {
					mediaService.playShot(1);
				}, 1800);
				jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
			};

			var failQuestion = function(){
				sessionData.user.preguntasErroneas = sessionData.user.preguntasErroneas + 1;
				saveUser();
				$rootScope.answered.fails = $rootScope.answered.fails + 1;
				efectAnsweredQuestion(false, id);
				setTimeout(function() {
					mediaService.playShot(2);
				}, 1800);
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
		UtilitiesService.initListenerTrophies();
	}]);

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
angular.module('services.questions', [])
.constant('configApp', applicationConfig)
.value('sessionData', {})
.service('UtilitiesService',['$ionicHistory', '$ionicPlatform', '$localStorage', '$location', '$state', '$rootScope', 'configApp', 'sessionData', function($ionicHistory, $ionicPlatform, $localStorage, $location, $state, $rootScope, configApp, sessionData) {
	var services = {};
	var statesLetButtonBack = ['menuMore', 'ranking', 'trophies'];
	$rootScope.initListenerTrophies = 0;

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
			$rootScope.user = sessionData.user;
			$location.path('/menu');
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

	services.initListenerTrophies = function(){

		var verifyTrophie = function(type, value){
			if($rootScope.initListenerTrophies === 3){
				if(type === 'incendios'){
					if(value === 8){
						console.log(descriptionTrophies.a_bomberito);
					}
					else if(value === 15){
						console.log(descriptionTrophies.b_bombero);
					}
					else if(value === 25){
						console.log(descriptionTrophies.c_capitan);
					}	
				}
				else if(type === 'evacuacion'){
					if(value === 8){
						console.log(descriptionTrophies.d_cadete);
					}
					else if(value === 15){
						console.log(descriptionTrophies.e_rescatista);
					}
					else if(value === 25){
						console.log(descriptionTrophies.f_brigadista);
					}
				}
				else{
					if(value === 15){
						console.log(descriptionTrophies.g_enfermerito);
					}
					else if(value === 25){
						console.log(descriptionTrophies.h_enfermero);
					}
					else if(value === 40){
						console.log(descriptionTrophies.i_jefe);
					}
				}
			}
			else {
				$rootScope.initListenerTrophies+=1;
			}
		};
		if($rootScope.initListenerTrophies === 0){
			var firebaseRef = new Firebase(configApp.USERS + "/" +sessionData.user.key);
			firebaseRef.child('preguntasAcertadas/evacuacion').on('value', function(snapshot) {
	  			verifyTrophie('evacuacion', snapshot.val());
			});
			firebaseRef.child('preguntasAcertadas/incendios').on('value', function(snapshot) {
	  			verifyTrophie('incendios', snapshot.val());
			});
			firebaseRef.child('preguntasAcertadas/primerosAuxilios').on('value', function(snapshot) {
	  			verifyTrophie('primerosAuxilios', snapshot.val());
			});
		}
	};
	return services;
}])
.factory("Auth", ['$firebaseAuth', 'configApp', function($firebaseAuth, configApp) {
	var usersRef = new Firebase(configApp.REF);
	return $firebaseAuth(usersRef);
}])
.filter('keyFilter', function() {
	return function(key) {
		return key.substring(2,key.length);
	};
});

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
                    });
                }
            });
        };
        $rootScope.reloadTrophies();
    }]);
