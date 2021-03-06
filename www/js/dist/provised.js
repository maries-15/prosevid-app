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

.run(['$ionicPlatform', 'UtilitiesService', function($ionicPlatform, UtilitiesService, sessionData) {
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
			if (typeof window.analytics !== "undefined") {
				window.analytics.startTrackerWithId('UA-78052996-1');
				window.analytics.trackEvent('System', 'Launch', 'Inicio de la aplicacion');
			};
		});

		UtilitiesService.initBackButtonController();
		UtilitiesService.loadDataUser();
		UtilitiesService.loadSuccessListener();
		//UtilitiesService.checkNetwork();
		UtilitiesService.checkFirebaseConection();
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
				controller: 'menuCtrl'
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
			.state('ranking', {
				url:'/ranking',
				templateUrl: "templates/ranking.html",
				controller: 'rankingCtrl'
			})
			.state('trophies', {
				url:'/trophies',
				templateUrl: "templates/trophies.html",
				controller: 'trophiesCtrl'
			})
			.state('about', {
				url:'/about',
				templateUrl: "templates/about.html"
			})
			.state('winner', {
				url:'/winner',
				templateUrl: "templates/winner.html"
			});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/login');
	}])
	.controller('menuCtrl', ['$scope', '$state', '$rootScope', 'sessionData', function($scope, $state, $rootScope, sessionData){
		$scope.play = function(){
			if(sessionData.user.win === false){
				if(typeof $rootScope.loadNextQuestion !== 'undefined'){
					$rootScope.loadNextQuestion()
				}
				$state.go('questions');
			}
			else{
				$state.go('winner');
			}
		};
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

				if(typeof window.analytics !== 'undefined'){
					window.analytics.trackEvent('Click', 'login', 'Inicio de sesión Exitoso');
				}
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
							questionSession: {
								acerts:0,
								fails:0
							},
							preguntasErroneas: 0,
							preguntasAcertadasT: 0,
							win: false
						};
						ref.child(user.key).set(user);
						refTrophies.child(user.key).set(trophies);
					}

					sessionData.user = user;
					$rootScope.user = sessionData.user;
					$localStorage.user = user;
					var questionsRef = new Firebase(configApp.QUESTIONS);
					if(user.nivel <= 20){
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
					else {
						$ionicLoading.hide();
						$state.go('menu');
					}
					
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
							$ionicLoading.show({
								template: 'Lo sentimos tu telefono no es compatible con esta aplicacion.',
								duration: 3000
							});
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
						$ionicLoading.show({
							template: 'Lo sentimos tu telefono no es compatible con esta aplicacion.',
							duration: 3000
						});
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
			console.log('questiosn');
		$scope.data = {};
		$scope.typeQuestion = "incendios";
		$rootScope.answered = sessionData.user.questionSession;
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
			if(sessionData.user.preguntasAcertadasT === 120){
				sessionData.user.win = true;
				if(typeof window.analytics !== 'undefined'){
					window.analytics.trackEvent('System', 'Winner', 'Usuario ha superado todos los niveles');
				}
			}
			var ref = new Firebase(configApp.USERS + "/"+ sessionData.user.key);
			ref.update(sessionData.user);
			$localStorage.user = sessionData.user;
		};

		var loadNextLevel = function(){
			//Update user level in database
			sessionData.user.nivel = sessionData.user.nivel + 1;
			sessionData.user.questionSession = {acerts:0,fails:0};
			$rootScope.answered = sessionData.user.questionSession;
			saveUser();
			//Get questions of the next level
			var questionsRef = new Firebase(configApp.QUESTIONS);
			console.log(sessionData.user.nivel);
			questionsRef.child('nivel' + sessionData.user.nivel).once('value', function(snapshot)
			{
				console.log(snapshot.exists());
				if (snapshot.exists()) {
					var questionsJson = snapshot.val();
					$localStorage.Questions = Object.keys(questionsJson).map(
						function(i) {
							return questionsJson[i];
						});
					questionsLevel = UtilitiesService.createNewArray($localStorage.Questions);
					console.log(questionsLevel);
					$localStorage.questionsLevel = questionsLevel;
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
				UtilitiesService.loadPopupTime();
				$rootScope.answered.fails = $rootScope.answered.fails + 1;
				sessionData.user.preguntasErroneas = sessionData.user.preguntasErroneas + 1;
				saveUser();
				setTimeout(function() {
					setHeightBlockScreen(0);
					jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
					
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
				$rootScope.answered.acerts = $rootScope.answered.acerts + 1;
				saveUser();

				efectAnsweredQuestion(true, id);
				setTimeout(function() {
					mediaService.playShot(1);
					UtilitiesService.showPopupTrophies($scope.typeQuestion, sessionData.user.preguntasAcertadas[$scope.typeQuestion], sessionData.user.preguntasAcertadasT);
				}, 1800);
				jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
			};

			var failQuestion = function(){
				sessionData.user.preguntasErroneas = sessionData.user.preguntasErroneas + 1;
				$rootScope.answered.fails = $rootScope.answered.fails + 1;
				saveUser();
				efectAnsweredQuestion(false, id);
				setTimeout(function() {
					mediaService.playShot(2);
				}, 1800);
				jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
			};

			if (answer === $scope.data.opcionCorrecta) {
				acertQuestion();
				if($rootScope.answered.acerts === 6){
					$rootScope.passLevelTemp = true;
					setTimeout(function() {
						loadNextLevel();
						if($rootScope.go !== true){
							delete $rootScope.passLevelTemp;
							$state.go('passLevel', {
								'navDirection':'forward'
							});
						}
					}, 3600);
					return;
				}
			} else {
				failQuestion();
			}

			setTimeout(function() {
				if($rootScope.go !== true){
					$state.go('completeQuestion', {
						'navDirection':'forward'
					});
				}
			}, 3600);
		};

		$rootScope.loadNextQuestion = function(){
			loadQuestion();
		};

		$rootScope.restartLevelUser = function(){
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
					loadQuestion();
				}
			});
		};

		loadQuestion();
	}]);

angular.module('starter.controllers')
.controller('rankingCtrl', ['$firebaseArray', '$scope', '$rootScope', 'configApp', 'sessionData', function($firebaseArray, $scope, $rootScope, configApp, sessionData) {

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
.service('UtilitiesService',['$ionicHistory', '$ionicPlatform', '$localStorage', '$location', '$state', '$rootScope', '$ionicPopup', '$timeout','configApp', 'sessionData', function($ionicHistory, $ionicPlatform, $localStorage, $location, $state, $rootScope, $ionicPopup, $timeout, configApp, sessionData) {
	var services = {};
	var statesLetButtonBack = ['ranking', 'trophies', 'about'];
	$rootScope.initListenerTrophies = 0;


	$rootScope.restartUser = function() {
		if(typeof window.analytics !== 'undefined'){
			window.analytics.trackEvent('Click', 'restart', 'Reiniciar datos de usuario');
		}
		sessionData.user.preguntasAcertadas = {
			incendios: 0,
			evacuacion: 0,
			primerosAuxilios: 0
		};

		sessionData.user.preguntasAcertadasT = 0;
		sessionData.user.preguntasErroneas = 0;
		sessionData.user.win = false;
		sessionData.user.nivel = 1;
		sessionData.user.questionSession = {acerts:0,fails:0};

		var ref = new Firebase(configApp.USERS + "/"+ sessionData.user.key);
		ref.update(sessionData.user);
		$localStorage.user = sessionData.user;

		delete $localStorage.questionsLevel;
		delete $localStorage.questionsLevel;

		if(typeof $rootScope.restartLevelUser !== 'undefined'){
			$rootScope.restartLevelUser();
			$state.go('questions');
		}
		else{
			var questionsRef = new Firebase(configApp.QUESTIONS);
			questionsRef.child('nivel' + sessionData.user.nivel).once('value', function(snapshotQ) {
				if (snapshotQ.exists()) {
					var questionsJson = snapshotQ.val();
					$localStorage.Questions = Object.keys(questionsJson).map(
						function(i) {
							return questionsJson[i];
						});
					$state.go('questions');
				}
			});
		}
	};

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
	};

	services.loadPopupTime = function(){
		
	   var alertPopup = $ionicPopup.show({
	     cssClass: 'popupTime',
	     template: '<div class="pop-text-time">TIEMPO FUERA</div>'
	   });

		timerOut = setTimeout(function()  {
		    alertPopup.close(); //close the popup after 3 seconds for some reason
		    $state.go('completeQuestion',{
		    	'navDirection':'forward'
		    });
		 }, 3000);
	};


	services.loadSuccessListener = function(){
		$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams)
		{
			if(typeof window.analytics !== 'undefined'){
				window.analytics.trackView(toState.name);
			}
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
				setTimeout(function() {
					$rootScope.backButtonPressedOnceToExit = false;
				}, 3000);
			}
			e.preventDefault();
			return false;
		}, 101);
	};

	services.showPopupTrophies = function(type, value, totalQuestions){
		
		var showPopupValue = false;
		var showPopup = function(trophie){
			showPopupValue = true;
			$rootScope.go = true;
			var firebaseRefTrophies = new Firebase(configApp.TROPHIES + "/" +sessionData.user.key + "/" + trophie + "/state");
			firebaseRefTrophies.set(true);
			trophie = trophie.substring(2, trophie.length);
			var popupTrophies = $ionicPopup.show({
		    	cssClass: 'popupThropies',
			    template: '<div ><img class="pop-img-thropie" src="img/thropies/' + trophie + '.png"><span class="pop-text-thropie">Te ganaste el trofeo de ' + trophie + '</span></div>'
		   });
			if($rootScope.win !== true){
				timerOut = setTimeout(function()  {
				    popupTrophies.close();
				    $rootScope.go = false;
				    if($rootScope.passLevelTemp === true){
				    	delete $rootScope.passLevelTemp;
				    	$state.go('passLevel',{
					    	'navDirection':'forward'
					    });
				    }
				    else{
				    	$state.go('completeQuestion',{
					    	'navDirection':'forward'
					    });
				    }
				 }, 5000);
			}
			else{
				timerOut = setTimeout(function()  {
				    popupTrophies.close();
				    $rootScope.go = false;
				    $state.go('winner',{
				    	'navDirection':'forward'
				    });
				 }, 3600);
			}
		};

		var showPopupCross = function(trophie){
			if(showPopupValue === true){
				var firebaseRefTrophies = new Firebase(configApp.TROPHIES + "/" +sessionData.user.key + "/" + trophie + "/state");
				firebaseRefTrophies.set(true);
			}
			else {
				showPopup(trophie);
			}
		};

		if(type === 'incendios'){
			if(value === 8){
				showPopup('a_bomberito');
			}
			else if(value === 15){
				showPopup('b_bombero');
			}
			else if(value === 25){
				showPopup('c_capitan');
			}	
		}
		else if(type === 'evacuacion'){
			if(value === 8){
				showPopup('d_cadete');
			}
			else if(value === 15){
				showPopup('e_rescatista');
			}
			else if(value === 25){
				showPopup('f_brigadista');
			}
		}
		else if(type === 'primerosAuxilios'){
			if(value === 15){
				showPopup('g_enfermerito');
			}
			else if(value === 25){
				showPopup('h_enfermero');
			}
			else if(value === 40){
				showPopup('i_jefe');
			}
		}

		if(totalQuestions === 50){
			showPopupCross('j_estudiante');
		}
		else if(totalQuestions === 80){
			showPopupCross('k_maestro');
		}
		else if(totalQuestions === 120){
			$rootScope.win = true;
			showPopupCross('l_experto');
		}
	};

	services.checkNetwork = function() {
		$rootScope.isOnline = true;

		var callbackFunctionOffline = function(){
			if(!$rootScope.isOnline) return;
			$timeout(function(){
				$rootScope.isOnline = false;
			});
		};

		var callbackFunctionOnline = function(){
			if($rootScope.isOnline) return;
			$timeout(function(){
				$rootScope.isOnline = true;
			});
		};

		document.addEventListener("offline", callbackFunctionOffline, false);
		document.addEventListener("online", callbackFunctionOnline, false);
	}

	services.checkFirebaseConection = function(){
		var firebaseRef = new Firebase(applicationConfig.REF);
		setTimeout(function() {
			firebaseRef.child('.info/connected').on('value', function(connectedSnap) {
			  	if (connectedSnap.val() === true) {
			    	$timeout(function(){
						$rootScope.isOnline = true;
					});
			  	} else {
			    	$timeout(function(){
						$rootScope.isOnline = false;
					});
			  	}
			});
		}, 1500);
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
