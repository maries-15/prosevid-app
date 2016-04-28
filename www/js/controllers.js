angular.module('starter.controllers', [])
	.controller('completeQuestionCtrl',['$rootScope', function($rootScope){
		jQuery('.barAnswer').css('width', (($rootScope.answered.acerts/6)*100) +'%');
	}]);