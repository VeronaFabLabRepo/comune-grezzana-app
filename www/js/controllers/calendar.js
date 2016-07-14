angular.module('comune_grezzana.calendar_controller', [])

.controller('CalendarController', function($scope, Calendar, $ionicPopup, GARBAGES, $ionicScrollDelegate) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

	$scope.showLoading();

	$scope.garbageDays = {};
	$scope.today = {};

	_checkMonthGarbage();

	$scope.$on('PREV_MONTH', function(event, month) {
		_checkMonthGarbage(month);
		$ionicScrollDelegate.scrollTop();
	});

	$scope.$on('NEXT_MONTH', function(event, month) {
		_checkMonthGarbage(month);
		$ionicScrollDelegate.scrollTop();
	});

	$scope.$on('SHOW_DAY_DETAILS', function(event, day) {

		$scope.showLoading();

		Calendar.getSingleDay(day).then(function(result) {

			$scope.hideLoading();

			if (result.errorMessage) {

				// CLEAN THE SESSION STORAGE
				sessionStorage.removeItem('previous');
				sessionStorage.removeItem('next');

			} else {

				var title = '',
					items = [];

				for (var day in result) {
					var date = moment.unix(day);
					title = date.format('DD') + ' ' + date.format('MMMM') + ' ' + date.format('YYYY');
					for ( var i = 0; i < result[day].items.length; i++) {
						if (result[day].items[i] != 'ecomobile') {
							items.push({
								name: GARBAGES[result[day].items[i]]
							});							
						}
					}
					
					$scope.ecomobile_text = '';
					if (result[day].ecomobile_text != null) {
						items.push({
							name: GARBAGES['ecomobile']
						});
						$scope.ecomobile_text = result[day].ecomobile_text;
					}
					$scope.items = items;

					break;
				}

				var alertPopup = $ionicPopup.alert({
					title: title,
					scope: $scope,
					templateUrl: 'templates/popup/single-day.html',
					cssClass: 'single_day',
					buttons: [{
						text: 'chiudi',
						type: 'button-positive',
						onTap: function(e) {
							return;
						}
					}]
				});

			}

		});

	});

	function _checkMonthGarbage(month) {
		if (!month) {
			month = moment().format('MM') + '-' + moment().format('YYYY');
		}
		_checkMonthGarbageOnLS(month);
	};

	function _checkMonthGarbageOnLS(month) {

		if (localStorage.getItem(month) != null) {

			$scope.hideLoading();
			$scope.garbageDays = JSON.parse(localStorage.getItem(month));
			_prepareToday();

		} else {

			Calendar.getCurrentMonth(month).then(function(result) {
				$scope.hideLoading();

				if (result.errorMessage) {

					// SHOW IONIC POPUP OR DON'T DO NOTHING
					$scope.showErrorMsg(result.errorMessage);

					// CLEAN THE SESSION STORAGE
					sessionStorage.removeItem('previous');
					sessionStorage.removeItem('next');
				} else {

					$scope.garbageDays = result;
					_prepareToday();
					localStorage.setItem(month, JSON.stringify(result));
				}
			});

		}
	};

	function _prepareToday() {

		if (sessionStorage.getItem('previous') != null || 
			sessionStorage.getItem('next') != null) {
			return;
		}

		var today = moment().hour(0).minute(0).second(0).millisecond(0).format('X'),
			//today = 1436306400,
			items = (typeof $scope.garbageDays[today] !== "undefined" ? $scope.garbageDays[today].items : []),
			tmp = [];

		for (var i = 0; i < items.length; i++) {
			tmp.push({
				id: items[i],
				name: GARBAGES[items[i]],
				text: (items[i] == 'ecomobile' ? $scope.garbageDays[today].ecomobile_text : '')
			});
		}

		$scope.today = {
			day: moment().format('DD'),
			month: moment().format('MMMM'),
			year: moment().format('YYYY'),
			items: tmp
		};

		$scope.openLegend = function() {

			$ionicPopup.alert({
				title: null,
				scope: $scope,
				templateUrl: 'templates/popup/legend.html',
				cssClass: 'legend_popup',
				buttons: [{
					text: 'CHIUDI',
					type: 'button-positive',
					onTap: function(e) {
						return;
					}
				}]
			});

		};

	}

});
