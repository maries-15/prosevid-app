// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
	'ionic',
	'firebase',
	'ngStorage',
	'starter.controllers',
	'questions.controllers',
	'login.controller',
	'services.questions'
	])

.run(['$ionicPlatform', 'UtilitiesService', function($ionicPlatform, UtilitiesService, sessionData) {
		$ionicPlatform.ready(function() {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

				// Don't remove this line unless you know what you are doing. It stops the viewport
				// from snapping when text inputs are focused. Ionic handles this internally for
				// a much nicer keyboard experience.
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}
			if (typeof window.analytics !== "undefined") {
				window.analytics.startTrackerWithId('UA-78052996-1');
				window.analytics.trackEvent('System', 'Launch', 'Inicio de la aplicacion');
			};
		});

		UtilitiesService.initBackButtonController();
		UtilitiesService.loadDataUser();
		UtilitiesService.loadSuccessListener();
		//UtilitiesService.checkNetwork();
		UtilitiesService.checkFirebaseConection();
	}])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			$stateProvider
			.state('login', {
				url:'/login',
				templateUrl: "templates/login.html",
				controller: 'loginCtrl'
			})
			.state('menu', {
				url:'/menu',
				templateUrl: "templates/menu.html",
				controller: 'menuCtrl'
			})
			.state('questions', {
				url:'/questions',
				templateUrl: "templates/questions.html",
				controller: 'questionsCtrl'
			})
			.state('completeQuestion', {
				url:'/completeQuestion',
				templateUrl: "templates/completeQuestion.html",
				controller: 'completeQuestionCtrl'
			})
			.state('passLevel', {
				url:'/passLevel',
				templateUrl: "templates/passLevel.html"
			})
			.state('ranking', {
				url:'/ranking',
				templateUrl: "templates/ranking.html",
				controller: 'rankingCtrl'
			})
			.state('trophies', {
				url:'/trophies',
				templateUrl: "templates/trophies.html",
				controller: 'trophiesCtrl'
			})
			.state('about', {
				url:'/about',
				templateUrl: "templates/about.html"
			})
			.state('winner', {
				url:'/winner',
				templateUrl: "templates/winner.html"
			});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/login');
	}])
	.controller('menuCtrl', ['$scope', '$state', '$rootScope', 'sessionData', function($scope, $state, $rootScope, sessionData){
		$scope.play = function(){
			if(sessionData.user.win === false){
				if(typeof $rootScope.loadNextQuestion !== 'undefined'){
					$rootScope.loadNextQuestion()
				}
				$state.go('questions');
			}
			else{
				$state.go('winner');
			}
		};
	}]);
