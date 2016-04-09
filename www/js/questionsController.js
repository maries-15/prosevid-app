angular.module('questions.controllers', [])
	.controller('questionsCtrl', ['$scope', '$localStorage', 'UtilitiesService', function($scope, $localStorage, UtilitiesService) {


		$scope.data = {};

		var questionsLevel = UtilitiesService.createNewArray($localStorage.Questions);

		var loadQuestion = function() {
			var questionRandom = parseInt(Math.random() * questionsLevel.length);
			$scope.data = questionsLevel[questionRandom];
			console.log(questionsLevel);
			questionsLevel.splice(questionRandom, 1);
			console.log(questionsLevel);
		};

		$scope.$on('loadQuestion', function(event, response) {
			loadQuestion();
		});

		$scope.validateAnswer = function(answer) {
			if (answer === $scope.data.opcionCorrecta) {
				alert("Muy Bien");
			} else {
				alert("Has fallado");
			}
			loadQuestion();
		};

		loadQuestion();
	}]);
