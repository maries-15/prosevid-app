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
			if(sessionData.user.preguntasAcertadasT === 120){
				sessionData.user.win = true;
			}
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
				UtilitiesService.loadPopupTime();
				sessionData.user.preguntasErroneas = sessionData.user.preguntasErroneas + 1;
				saveUser();
				setTimeout(function() {
					setHeightBlockScreen(0);
					$rootScope.answered.fails = $rootScope.answered.fails + 1;
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
				saveUser();

				$rootScope.answered.acerts = $rootScope.answered.acerts + 1;
				efectAnsweredQuestion(true, id);
				setTimeout(function() {
					mediaService.playShot(1);
					UtilitiesService.showPopupTrophies($scope.typeQuestion, sessionData.user.preguntasAcertadas[$scope.typeQuestion], sessionData.user.preguntasAcertadasT);
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
		loadQuestion();
	}]);
