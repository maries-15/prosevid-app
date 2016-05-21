angular.module('services.questions', [])
.constant('configApp', applicationConfig)
.value('sessionData', {})
.service('UtilitiesService',['$ionicHistory', '$ionicPlatform', '$localStorage', '$location', '$state', '$rootScope', '$ionicPopup','configApp', 'sessionData', function($ionicHistory, $ionicPlatform, $localStorage, $location, $state, $rootScope, $ionicPopup, configApp, sessionData) {
	var services = {};
	var statesLetButtonBack = ['ranking', 'trophies', 'about'];
	$rootScope.initListenerTrophies = 0;


	$rootScope.restartUser = function() {
		if(typeof window.analytics !== 'undefined'){
			window.analytics.trackEvent('Click', 'restart', 'Reiniciar datos de usuario');
		}
		sessionData.user.preguntasAcertadas = {
			incendios: 0,
			evacuacion: 0,
			primerosAuxilios: 0
		};

		sessionData.user.preguntasAcertadasT = 0;
		sessionData.user.preguntasErroneas = 0;
		sessionData.user.win = false;
		sessionData.user.nivel = 1;

		var ref = new Firebase(configApp.USERS + "/"+ sessionData.user.key);
		ref.update(sessionData.user);
		$localStorage.user = sessionData.user;

		delete $localStorage.questionsLevel;
		delete $localStorage.questionsLevel;

		if(typeof $rootScope.restartLevelUser !== 'undefined'){
			$rootScope.restartLevelUser();
			$state.go('questions');
		}
		else{
			var questionsRef = new Firebase(configApp.QUESTIONS);
			questionsRef.child('nivel' + sessionData.user.nivel).once('value', function(snapshotQ) {
				if (snapshotQ.exists()) {
					var questionsJson = snapshotQ.val();
					$localStorage.Questions = Object.keys(questionsJson).map(
						function(i) {
							return questionsJson[i];
						});
					$state.go('questions');
				}
			});
		}
	};

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
	     template: '<div class="pop-text-time">TIEMPO FUERA</div>'
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
			if(typeof window.analytics !== 'undefined'){
				window.analytics.trackView(toState.name);
			}
			if ($rootScope.height === undefined) {
				$rootScope.height = jQuery('ion-nav-view').height();
			}
			if ($rootScope.loadComplete !== 1) {
				$rootScope.loadComplete = 1;
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
				setTimeout(function() {
					$rootScope.backButtonPressedOnceToExit = false;
				}, 3000);
			}
			e.preventDefault();
			return false;
		}, 101);
	};

	services.showPopupTrophies = function(type, value, totalQuestions){
		
		var showPopupValue = false;
		var showPopup = function(trophie){
			showPopupValue = true;
			$rootScope.go = true;
			var firebaseRefTrophies = new Firebase(configApp.TROPHIES + "/" +sessionData.user.key + "/" + trophie + "/state");
			firebaseRefTrophies.set(true);
			trophie = trophie.substring(2, trophie.length);
			var popupTrophies = $ionicPopup.show({
		    	cssClass: 'popupThropies',
			    template: '<div ><img class="pop-img-thropie" src="img/thropies/' + trophie + '.png"><span class="pop-text-thropie">Te ganaste el trofeo de ' + trophie + '</span></div>'
		   });
			if($rootScope.win !== true){
				timerOut = setTimeout(function()  {
				    popupTrophies.close();
				    $rootScope.go = false;
				    $state.go('completeQuestion',{
				    	'navDirection':'forward'
				    });
				 }, 5000);
			}
			else{
				timerOut = setTimeout(function()  {
				    popupTrophies.close();
				    $rootScope.go = false;
				    $state.go('winner',{
				    	'navDirection':'forward'
				    });
				 }, 3600);
			}
		};

		var showPopupCross = function(trophie){
			if(showPopupValue === true){
				var firebaseRefTrophies = new Firebase(configApp.TROPHIES + "/" +sessionData.user.key + "/" + trophie + "/state");
				firebaseRefTrophies.set(true);
			}
			else {
				showPopup(trophie);
			}
		};

		if(type === 'incendios'){
			if(value === 8){
				showPopup('a_bomberito');
			}
			else if(value === 15){
				showPopup('b_bombero');
			}
			else if(value === 25){
				showPopup('c_capitan');
			}	
		}
		else if(type === 'evacuacion'){
			if(value === 8){
				showPopup('d_cadete');
			}
			else if(value === 15){
				showPopup('e_rescatista');
			}
			else if(value === 25){
				showPopup('f_brigadista');
			}
		}
		else if(type === 'primerosAuxilios'){
			if(value === 15){
				showPopup('g_enfermerito');
			}
			else if(value === 25){
				showPopup('h_enfermero');
			}
			else if(value === 40){
				showPopup('i_jefe');
			}
		}

		if(totalQuestions === 50){
			showPopupCross('j_estudiante');
		}
		else if(totalQuestions === 80){
			showPopupCross('k_maestro');
		}
		else if(totalQuestions === 120){
			$rootScope.win = true;
			showPopupCross('l_experto');
		}
	};

	services.checkNetwork = function() {
		var isOnline = true;

		var showPopup = function(){
			$rootScope.alertPopup = $ionicPopup.alert({
	    		title: 'Oops',
	    		template: 'Lo sentimos no estas conectado a internet',
	    		cssClass:'noConnectionPopUp'
	   		});
		};

		var hidePopUp = function(){
			if($rootScope.alertPopup !== undefined){
				$rootScope.alertPopup.close();
				$rootScope.alertPopup = undefined;
			}
		}

		var callbackFunctionOffline = function(){
			if(!isOnline) return;
			isOnline = false;
			showPopup();
		};

		var callbackFunctionOnline = function(){
			if(isOnline) return;
			isOnline = true;
			hidePopUp();
		};

		document.addEventListener("offline", callbackFunctionOffline, false);
		document.addEventListener("online", callbackFunctionOnline, false);
	}
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
