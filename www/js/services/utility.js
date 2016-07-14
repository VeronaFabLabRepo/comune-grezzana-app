angular.module('comune_grezzana.utility_services', [])

.factory('getBaseApiURL', function(CONFIG) {
	return CONFIG.baseURL;
})

.factory('transformRequestAsFormPost', function() {
 
 	return function(obj) {
		var str = [];
		for(var p in obj) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
		return str.join("&");
	}
 
})

;