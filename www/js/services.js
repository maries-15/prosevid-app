var firebaseRef = 'https://prosevid-app.firebaseio.com/';
var applicationConfig = {
	REF: firebaseRef,
	USERS: firebaseRef + '/users',
	QUESTIONS: firebaseRef + '/questions'
}

angular.module('services.questions', [])
	.constant('configApp', applicationConfig)
	.value('sessionData', {})
	.service('UtilitiesService',['$rootScope', function($rootScope) {
		var services = {};

		services.createNewArray = function(array){
			var newArray = [];
			for(var i = 0; i < array.length; i++){
				newArray.push(array[i]);
			}
			return newArray;
		}

		return services;
	}]);
