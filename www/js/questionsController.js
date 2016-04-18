angular.module('questions.controllers', [])
	.controller('questionsCtrl', ['$scope', '$localStorage', '$state', '$timeout', 'configApp', 'sessionData', 'UtilitiesService', 
		function($scope, $localStorage, $state, $timeout, configApp, sessionData, UtilitiesService) {


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
			loadQuestion();
		};

		$scope.$on('loadQuestion', function(event, response) {
			loadQuestion();
		});
		loadQuestion();
	}]);
