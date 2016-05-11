angular.module('starter')
	.service('mediaService', ['$rootScope', function($rootScope) {

		var services = {};

		var media;
		var path = '/android_asset/www/sources/';
		var routes = ['timer.mp3','win.mp3','fail.mp3'];

		services.playShot = function(position) {
			if(typeof Media !== 'undefined'){
				media = new Media(path + routes[position], function() {
					media.release();
				}, function(error) {
					console.log('error', media.src, error);
				});
				media.play();
			}
		};

		services.pauseShot = function() {
			if(typeof Media !== 'undefined'){
				media.pause();
			}
		};

		services.stopShot = function() {
			if(typeof Media !== 'undefined'){
				media.stop();
				media.release();
			}
		};

		return services;
	}]);
