angular.module('comune_grezzana.app_controller', ['ionic'])

.controller('AppController', function($scope, $ionicPopup, $ionicLoading, $cordovaCamera, $cordovaGeolocation) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

	$scope.showLoading = function() {
		$ionicLoading.show();
	};

	$scope.hideLoading = function() {
		$ionicLoading.hide();
	};

	$scope.showErrorMsg = function(message, redirect) {

		var msg = (message != null ? message : 'Si è verificato un errore.');

		var alertPopup = $ionicPopup.alert({
			title: 'Errore',
			template: msg,
			cssClass: 'error',

			buttons: [{
				text: 'OK',
				type: 'button-assertive',
				onTap: function(e) {
					return;
				}
			}]
		});

		if (redirect) {
			alertPopup.then(function(res) {
				$location.path(redirect);
			});
		}
	};

	$scope.showSuccessMsg = function(msg, redirect, className) {

		var alertPopup = $ionicPopup.alert({
			title: msg.title,
			template: msg.text,
			cssClass: 'success' + (className != '' ? ' ' + className : ''),
			okType: 'button-positive'
		});

		if (redirect) {
			alertPopup.then(function(res) {
				setTimeout(function() {
					$location.path(redirect);
				}, 1);
			});
		}

	};

	$scope.openCamera = function(size) {

		var options = {
			quality: 90,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: false,
			cameraDirection: 0,
			encodingType: Camera.EncodingType.JPEG,
			correctOrientation: true,
			targetWidth: 300,
			targetHeight: 300,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false
		};

		if (typeof size !== "undefined") {
			options.targetWidth = size;
			options.targetHeight = size;
		}

		return $cordovaCamera.getPicture(options).then(function(imageData) {
			return "data:image/jpeg;base64," + imageData;
		});

	};

	$scope.getPosition = function() {

		var posOptions = {
			timeout: 10000,
			enableHighAccuracy: false
		};

		return $cordovaGeolocation
			.getCurrentPosition(posOptions)
			.then(function (position) {
				return {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
			}, function(err) {
				return { errorMessage: 'Errore!' };
			});

	};

});
