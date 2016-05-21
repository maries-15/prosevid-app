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
							$ionicLoading.hide();
							if(msg === 'service not available'){
								$ionicLoading.show({
									template: 'Lo sentimos tu telefono no es compatible con esta aplicacion.',
									duration: 3000
								});
							};
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
