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
