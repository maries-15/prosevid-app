angular.module('questions.controllers', [])
	.controller('questionsCtrl', ['$scope', '$localStorage', '$state', '$rootScope', '$timeout', 'configApp', 'sessionData', 'UtilitiesService', 
		function($scope, $localStorage, $state, $rootScope, $timeout, configApp, sessionData, UtilitiesService) {


		$scope.data = {};
		$scope.typeQuestion = "incendios";
		$scope.answered = {
			acerts:0,
			fails:0
		};
		var timerOut;

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
			startTimeOutCheck();
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
					$scope.answered = {
						acerts:0,
						fails:0
					};
				}
			});
		};

		var startTimeOutCheck = function(){
			timerOut = setTimeout(function() {
				jQuery('#blockScreen').css('height',$rootScope.height);
				console.log("Mostrar time out");
				setTimeout(function() {
					jQuery('#blockScreen').css('height', 0);
					$scope.answered.fails = $scope.answered.fails + 1;
					if($scope.answered.fails === 3){
						console.log("perdio impedido");
					}
					else{
						$state.go('completeQuestion',{
							'navDirection':'forward'
						});
					}
				}, 1500);
			}, 18000);
		};

		$scope.validateAnswer = function(answer, id) {
			stopTimer();
			clearTimeout(timerOut);
			jQuery('#blockScreen').css('height',$rootScope.height);
			if (answer === $scope.data.opcionCorrecta) {
				$scope.answered.acerts = $scope.answered.acerts + 1;
				efectAnsweredQuestion(true, id);
				if($scope.answered.acerts === 2){
					setTimeout(function() {
						loadNextLevel();
						$state.go('passLevel', {
							'navDirection':'forward'
						});
					}, 3600);
					return;
				}
			} else {
				$scope.answered.fails = $scope.answered.fails + 1;
				efectAnsweredQuestion(false, id);
				if($scope.answered.fails === 3){
					console.log("perdio impedido");
				}
			}
			setTimeout(function() {
				$state.go('completeQuestion', {
					'navDirection':'forward'
				});
			}, 3600);
		};

		$scope.$on('loadQuestion', function(event, response) {
			loadQuestion();
		});

		$scope.$on('loadNextLevel', function(event, response){
			loadNextLevel();
		});

		$rootScope.loadNextQuestion = function(){
			loadQuestion();
		};

		loadQuestion();
	}]);
