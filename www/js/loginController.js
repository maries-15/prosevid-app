angular.module('login.controller', [])
	.controller('loginCtrl', ['$ionicLoading', '$localStorage', '$scope', '$state', 'configApp', 'sessionData', function($ionicLoading, $localStorage, $scope, $state, configApp, sessionData) {

		$scope.data = {};

		$scope.registerUser = function() {
			$ionicLoading.show({
				template: 'Autenticando...'
			});

			var ref = new Firebase(configApp.USERS);
			var refTrophies = new Firebase(configApp.TROPHIES);
			

			//eliminar desde aqui			
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
			//hasta aqui

			
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
				},
				function(msg) {
					console.log('error: ', msg);
				}
			);
		};
	}]);
