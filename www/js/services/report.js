angular.module('comune_grezzana.report_service', [])

	.factory('Report', function($http, getBaseApiURL, transformRequestAsFormPost) {

		var report = {};

		report.addReport = function(report) {

			var url = getBaseApiURL + '/report/';
			var data = {
				report_photo: report.photo,
				report_fullname: report.fullname,
				report_description: report.description,
				report_lat: report.lat,
				report_lng: report.lng,
				save: true
			};

			return $http({

				method: 'post',
				url: url,
				transformRequest: transformRequestAsFormPost,
				data: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}

			}).then(function(result) {
				result = result.data;
				if (result.result == 'ko') {
					return {errorMessage: result.data};
				} else {
					return result.data;
				}
			});

		};

		return report;

	});