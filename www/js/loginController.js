angular.module('login.controller', [])
	.controller('loginCtrl', ['$ionicLoading', '$localStorage', '$scope', '$state', 'configApp', 'sessionData', function($ionicLoading, $localStorage, $scope, $state, configApp, sessionData) {

		$scope.data = {};

		$scope.registerUser = function() {
			$ionicLoading.show({
				template: 'Autenticando...'
			});

			var ref = new Firebase(configApp.USERS);
			ref.child('anma2510').once('value', function(snapshot) {
				if (snapshot.exists()) {
					user = snapshot.val();
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
									questionsLevel = UtilitiesService.transformJsonToArray(snapshotQ.val());
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
