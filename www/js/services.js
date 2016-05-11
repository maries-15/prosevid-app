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
	bombero:{
		state:false
	},
	enfermero: {
		state:false
	}
};
var descriptionTrophies = {
	bombero:{
		description:"Responde correctamente 10 preguntas de incendios."
	},
	enfermero:{
		description:"Responde correctamente 20 preguntas de primeros auxilios."
	}
};


angular.module('services.questions', [])
	.constant('configApp', applicationConfig)
	.value('sessionData', {})
	.service('UtilitiesService',['$ionicHistory', '$ionicPlatform', '$localStorage', '$location', '$state', '$rootScope', 'sessionData', function($ionicHistory, $ionicPlatform, $localStorage, $location, $state, $rootScope, sessionData) {
		var services = {};
		var statesLetButtonBack = ['menuMore', 'ranking', 'trophies'];

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
				//$location.path('/menu');
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
		return services;
	}]);
