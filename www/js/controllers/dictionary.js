angular.module('comune_grezzana.dictionary_controller', [])

.controller('DictionaryController', function($scope, Dictionary, GARBAGES) {

	$scope.showLoading();

	$scope.dictionaryList = [];
	$scope.dictionaryListOffset = 1;
	$scope.dictionaryLimit = 5;
	$scope.moreDictionaryAvailable = null;

	$scope.Dictionary = {};
	$scope.Dictionary.search = '';
	$scope.Dictionary.searchDone = false;
	$scope.searchList = [];

	// On loading, start to load the invoices
	$scope.$on('$stateChangeSuccess', function() {
		$scope.loadMoreDictionary();
	});

	// LOAD DICTIONARY ITEMS
	$scope.loadMoreDictionary = function() {

		Dictionary.getList($scope.dictionaryListOffset, $scope.dictionaryLimit).then(function(data) {

			$scope.hideLoading();

			if (!data.errorMessage) {
				if (data.length > 0) {
					$scope.dictionaryListOffset = $scope.dictionaryListOffset + data.length;
					$scope.moreDictionaryAvailable = (data.length == $scope.dictionaryLimit ? true : false);
					
					$scope.dictionaryList = $scope.dictionaryList.concat($scope._parseData(data));
					$scope.$broadcast('scroll.infiniteScrollComplete');
				} else {
					$scope.moreDictionaryAvailable = false;
				}
			} else {
				$scope.showErrorMsg(data.errorMessage);
			}

		}, function() {
			$scope.hideLoading();
			$scope.showErrorMsg();
		});

	};

	$scope.moreDictionaryCanBeLoaded = function() {
		return $scope.moreDictionaryAvailable;
	};

	$scope._parseData = function(data) {
		var tmp = new Array();
		for (var i = 0; i < data.length; i++) {
			tmp.push({
				'title' : data[i].title,
				'description': data[i].dictionary_description,
				'item_id': data[i].dictionary_items,
				'item_description': GARBAGES[data[i].dictionary_items]
			});
		}
		return tmp;
	};

	$scope.searchDictionary = function() {

		$scope.showLoading();

		$scope.Dictionary.searchDone = true;

		Dictionary.searchDictionary($scope.Dictionary.search).then(function(data) {
			$scope.hideLoading();

			if (!data.errorMessage) {
				if (data.length > 0) {
					$scope.searchList = $scope._parseData(data);
				}
			} else {
				$scope.showErrorMsg(data.errorMessage);
			}

		}, function() {
			$scope.hideLoading();
			$scope.showErrorMsg();
		});

	};

	$scope.clearSearch = function() {
		$scope.Dictionary.searchDone = false;
		$scope.Dictionary.search = '';
		$scope.searchList = [];
	};

});
