angular.module('comune_grezzana.report_controller', [])

.controller('ReportController', function($scope, Report, $ionicPopup) {

	$scope.report = {
		photo: '',
		fullname: '',
		description: '',
		lat: '',
		lng: ''
	};

	$scope.addPhoto = function() {

		$scope.openCamera().then(function(result) {

			if (!result.errorMessage) {
				$scope.report.photo = result;
			} else {
				$scope.showErrorMsg();
			}

		}, function() {
			$scope.hideLoading();
		});

	};

	$scope.addPosition = function() {

		$scope.showLoading();

		$scope.getPosition().then(function(result) {
			$scope.hideLoading();

			if (result.errorMessage) {
				$scope.showErrorMsg('Ci dispiace, si è verificato un\'errore. Controlla se le impostazioni di geolocalizzazione sono su attive.');
			} else {
				$scope.report.lat = result.lat;
				$scope.report.lng = result.lng;
			}

		});

	};

	$scope.sendReport = function() {

		$scope.showLoading();

		Report.addReport($scope.report).then(function() {
			$scope.hideLoading();

			$scope.report = {
				photo: 'img/trans.gif',
				fullname: '',
				description: '',
				lat: '',
				lng: ''
			};

			$scope.showSuccessMsg({
				title: 'Complimenti!',
				text: 'Abbiamo ricevuto la tua segnalazione, la elaboreremo quanto prima.'
			});

		}, function() {
			$scope.showErrorMsg('Ci dispiace, si è verificato un\'errore');
		});

	};

});
