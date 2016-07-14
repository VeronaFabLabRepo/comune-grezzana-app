angular.module('comune_grezzana.dictionary_service', [])

.factory('Dictionary', function($http, getBaseApiURL, transformRequestAsFormPost) {

	var Dictionary = {};

	Dictionary.getList = function(offset, limit) {

		var url = getBaseApiURL + '/dictionary/?';

		if (offset) {
			url += 'offset=' + offset;
		}
		if (limit) {
			url += '&limit=' + limit;
		}


		return $http({

			method: 'get',
			url: url

		}).then(function(result) {
			if (result.result == 'ko') {
				return {errorMessage: result.data};
			} else {
				result = result.data.data[0];
				result = Object.keys(result).map(function(k) { return result[k] });
				return result;
			}
		});

	};

	Dictionary.searchDictionary = function(voice) {

		var url = getBaseApiURL + '/dictionary/?search=' + voice;

		return $http({

			method: 'get',
			url: url

		}).then(function(result) {
			if (result.result == 'ko') {
				return {errorMessage: result.data};
			} else {
				result = result.data.data[0];
				result = Object.keys(result).map(function(k) { return result[k] });
				return result;
			}
		});

	};

	return Dictionary;

});