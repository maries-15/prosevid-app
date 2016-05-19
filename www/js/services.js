angular.module('services.questions', [])
.constant('configApp', applicationConfig)
.value('sessionData', {})
.service('UtilitiesService',['$ionicHistory', '$ionicPlatform', '$localStorage', '$location', '$state', '$rootScope', '$ionicPopup','configApp', 'sessionData', function($ionicHistory, $ionicPlatform, $localStorage, $location, $state, $rootScope, $ionicPopup, configApp, sessionData) {
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

	services.loadPopupTime = function(){
		
	   var alertPopup = $ionicPopup.show({
	     cssClass: 'popupTime',
	     templateUrl: 'templates/popupTime.html'
	   });

		timerOut = setTimeout(function()  {
		    alertPopup.close(); //close the popup after 3 seconds for some reason
		    $state.go('completeQuestion',{
		    	'navDirection':'forward'
		    });
		 }, 3000);
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
			var showPopup = false;
			var whichTrophie = "";
			if($rootScope.initListenerTrophies === 3){

				if(type === 'incendios'){
					if(value === 8){
						showPopup = true;
						whichTrophie = "bomberito";
						console.log(descriptionTrophies.a_bomberito);
					}
					else if(value === 15){
						showPopup = true;
						whichTrophie = "bombero";
						console.log(descriptionTrophies.b_bombero);
					}
					else if(value === 25){
						showPopup = true;
						whichTrophie = "capitan";
						console.log(descriptionTrophies.c_capitan);
					}	
				}
				else if(type === 'evacuacion'){
					if(value === 8){
						showPopup = true;
						whichTrophie = "cadete";
						console.log(descriptionTrophies.d_cadete);
					}
					else if(value === 15){
						showPopup = true;
						whichTrophie = "rescatista";
						console.log(descriptionTrophies.e_rescatista);
					}
					else if(value === 25){
						showPopup = true;
						whichTrophie = "brigadista";
						console.log(descriptionTrophies.f_brigadista);
					}
				}
				else{
					if(value === 15){
						showPopup = true;
						whichTrophie = "enfermerito";
						console.log(descriptionTrophies.g_enfermerito);
					}
					else if(value === 25){
						showPopup = true;
						whichTrophie = "enfermero";
						console.log(descriptionTrophies.h_enfermero);
					}
					else if(value === 40){
						showPopup = true;
						whichTrophie = "jefe";
						console.log(descriptionTrophies.i_jefe);
					}
				}
			}
			else {
				$rootScope.initListenerTrophies+=1;
			}

			if(showPopup == true){
				var popupTrophies = $ionicPopup.show({
			     cssClass: 'popupThropies',
			     // templateUrl: 'templates/popupTrophies.html'
			     template: '<div ><img class="pop-img-thropie" src="img/thropies/' + whichTrophie + '.png"><span class="pop-text-thropie">Te ganaste el trofeo de ' + whichTrophie + '</span></div>'
			   });
				timerOut = setTimeout(function()  {
				    popupTrophies.close(); //close the popup after 3 seconds for some reason
				    // $state.go('completeQuestion',{
				    // 	'navDirection':'forward'
				    // });
				 }, 5000);
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
