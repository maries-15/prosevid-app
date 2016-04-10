angular.module('questions.controllers', [])
	.controller('questionsCtrl', ['$scope', '$localStorage', '$timeout', 'configApp', 'sessionData', 'UtilitiesService', 
		function($scope, $localStorage, $timeout, configApp, sessionData, UtilitiesService) {


		$scope.data = {};
		var acertadas = 0;
		var fallidas = 0;

		var questionsLevel = UtilitiesService.createNewArray($localStorage.Questions);
		console.log(questionsLevel.length);

		var loadQuestion = function() {
			var questionRandom = parseInt(Math.random() * questionsLevel.length);
			$scope.data = questionsLevel[questionRandom];
			questionsLevel.splice(questionRandom, 1);
		};

		var loadNextLevel = function(){
			//Update user level in database
			var ref = new Firebase(configApp.USERS + "/"+ sessionData.user.key);
			sessionData.user.nivel = sessionData.user.nivel + 1;
			ref.update({nivel: sessionData.user.nivel});
			$localStorage.user = sessionData.user.nivel;

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

		$scope.$on('loadQuestion', function(event, response) {
			loadQuestion();
		});

		$scope.validateAnswer = function(answer) {
			if (answer === $scope.data.opcionCorrecta) {
				acertadas++;
				alert("Muy Bien" + acertadas);
				if(acertadas === 6){
					alert("paso de nivel");
					loadNextLevel();
					return;
				}
			} else {
				fallidas++;
				alert("Has fallado");
				if(fallidas === 3){
					//Reiniciar Nivel
					alert("persio impedido");
				}
			}
			alert("antes de cargar");
			loadQuestion();
		};
		loadQuestion();
	}]);
