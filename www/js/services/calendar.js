angular.module('comune_grezzana.calendar_service', [])

	.factory('Calendar', function($http, getBaseApiURL, transformRequestAsFormPost) {

		var calendar = {};

		calendar.getCurrentMonth = function(monthYear) {

			var url = getBaseApiURL + '/calendar/';

			if (monthYear) {
				url += '?month_year=' + monthYear;
			}

			return $http({

				method: 'get',
				url: url,

			}).then(function(result) {
				result = result.data;
				if (result.result == 'ko') {
					return {errorMessage: result.data};
				} else {
					return result.data;
				}
			});

		};

		calendar.getSingleDay = function(day) {

			var url = getBaseApiURL + '/calendar/?day=' + day;

			return $http({

				method: 'get',
				url: url,

			}).then(function(result) {
				result = result.data;
				if (result.result == 'ko') {
					return {errorMessage: result.data};
				} else {
					return result.data;
				}
			});

		};

		return calendar;

	});