// App Comune di Grezzana
angular.module('comune_grezzana', ['ionic', 'ngCordova',
											'comune_grezzana.app_controller',
											'comune_grezzana.index_controller',
											'comune_grezzana.calendar_controller',
											'comune_grezzana.dictionary_controller',
											'comune_grezzana.report_controller',
											'comune_grezzana.credits_controller',

											'comune_grezzana.utility_services',
											'comune_grezzana.calendar_service',
											'comune_grezzana.dictionary_service',
											'comune_grezzana.report_service',

											'comune_grezzana.calendar_directive'])

.constant('$ionicLoadingConfig', {
	template: 'Caricamento...'
})

.constant('CONFIG', {
	baseURL: 'http://167.88.36.214'
})

.constant('GARBAGES', {

	humid: 'Umido',
	plastic: 'Plastica / Lattine',
	dry: 'Secco',
	paper: 'Carta',
	ecomobile: 'Ecomobile',
	green_b_zone: 'Verde Zona B',
	green_a_zone: 'Verde Zona A'

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	$stateProvider

		.state('app', {
			url: '/app',
			abstract: true, // Indica che questo stato verrà attivato quando uno degli stati figli vengono attivati
			templateUrl: 'templates/menu.html',
			controller: 'AppController'
		})

		.state('app.index', {
			url: '/index',
			views: {
				'menuContent' :{
					templateUrl: "templates/index/index.html",
					controller: 'IndexController'
				}
			}
		})

		.state('app.credits', {
			url: '/credits',
			views: {
				'menuContent' :{
					templateUrl: "templates/credits/index.html",
					controller: 'CreditsController'
				}
			}
		})

		.state('app.dictionary', {
			url: '/dictionary',
			views: {
				'menuContent' :{
					templateUrl: "templates/dictionary/index.html",
					controller: 'DictionaryController'
				}
			}
		})

		.state('app.calendar', {
			url: '/calendar',
			views: {
				'menuContent' :{
					templateUrl: "templates/calendar/index.html",
					controller: 'CalendarController'
				}
			}
		})

		.state('app.report', {
			url: '/report',
			views: {
				'menuContent' :{
					templateUrl: "templates/report/index.html",
					controller: 'ReportController'
				}
			}
		});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/index');


	// Overwrite Ionic Styles
	$ionicConfigProvider.backButton.text('').icon('ion-arrow-left-c');
	$ionicConfigProvider.backButton.previousTitleText(false);


})

.run(function($ionicPlatform) {

	$ionicPlatform.ready(function() {

		if (window.cordova) {
			ionic.Platform.fullScreen();
		}

		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.hide();
		}
	});

});


