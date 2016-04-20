var firebaseRef = 'https://prosevid-app.firebaseio.com/';
var applicationConfig = {
	REF: firebaseRef,
	USERS: firebaseRef + '/users',
	QUESTIONS: firebaseRef + '/questions'
}

angular.module('services.questions', [])
	.constant('configApp', applicationConfig)
	.value('sessionData', {})
	.service('UtilitiesService',['$ionicHistory', '$ionicPlatform', '$localStorage', '$rootScope', 'sessionData', function($ionicHistory, $ionicPlatform, $localStorage, $rootScope, sessionData) {
		var services = {};
		var statesLetButtonBack = ['menuMore', 'ranking', 'trophies'];

		services.createNewArray = function(array){
			var newArray = [];
			for(var i = 0; i < array.length; i++){
				newArray.push(array[i]);
			}
			return newArray;
		};

		services.loadUser = function(){
			if($localStorage.user){
				sessionData.user = $localStorage.user;
			};
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
