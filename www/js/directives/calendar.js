angular.module('comune_grezzana.calendar_directive', [])

.directive('calendar', function() {

	return {
		restrict: "E",
		templateUrl: "templates/calendar/calendar.html",
		scope: {
			selected: "=",
			garbageDays: "@"
		},
		link: function(scope) {

			// moment() => data e ora corrente

			// Utilizza la data passata nella direttiva o istanzia un moment
			scope.selected = _removeTime(scope.selected || moment());

			scope.month = scope.selected.clone();
			var start = scope.selected.clone();

			// Imposta la data di start al primo giorno del mese
			start.date(1);

			// Imposta il primo giorno della settimana come lunedì
			_removeTime(start.day(1));

			// Costruisci il mese
			_buildMonth(scope, start, scope.month);

			scope.$watch('garbageDays', function(newVal) {

				if (sessionStorage.getItem('next') != null) {

					var next = moment(sessionStorage.getItem('next'));
					sessionStorage.removeItem('next');
					_buildMonth(scope, next, scope.month);

				} else if (sessionStorage.getItem('previous') != null) {

					var previous = moment(sessionStorage.getItem('previous'));
					sessionStorage.removeItem('previous');
					_buildMonth(scope, previous, scope.month);

				} else {

					_buildMonth(scope, start, scope.month);

				}
				
			});

			scope.select = function(day) {
				scope.selected = day.date;
				scope.$emit('SHOW_DAY_DETAILS', day.date.format('DD') + '-' + day.date.format('MM') + '-' + day.date.format('YYYY'));
			};

			scope.next = function() {
				// Next = mese corrente
				var next = scope.month.clone();
				_removeTime(next.month(next.month()+1)).date(1);
				scope.month.month(scope.month.month()+1);

				_buildMonth(scope, next, scope.month);
				sessionStorage.setItem('next', next);
				scope.$emit('NEXT_MONTH', scope.month.format('MM') + '-' + scope.month.format('YYYY'));
			};

			scope.previous = function() {
				var previous = scope.month.clone();
				_removeTime(previous.month(previous.month()-1).date(1));
				scope.month.month(scope.month.month()-1);

				_buildMonth(scope, previous, scope.month);
				sessionStorage.setItem('previous', previous);
				scope.$emit('PREV_MONTH', scope.month.format('MM') + '-' + scope.month.format('YYYY'));
			};

			scope.className = function(day) {
				var className = [];
				className.push(!day.isCurrentMonth ? 'different-month' : '');
				className.push((day.items ? 'garbage ' + day.items : ''));
				//className.push(day.date.isSame(selected) ? 'selected' : '');
				//className.push((day.isToday ? 'today ' : ''));
				return className.join(' ');
			};

		}
    };

    // Imposta tutti i tempi a 0
	function _removeTime(date) {
		return date.hour(0).minute(0).second(0).millisecond(0);
	}

	// Costrusci le righe del mese
	function _buildMonth(scope, start, month) {

		// Prendi i giorni di raccolta rifiuti
		var garbageDays = JSON.parse(scope.garbageDays);

		// Istanzia l'array delle settimane del mese
		scope.weeks = [];
		var done = false,
			date = start.clone();

		while (!done) {

			// Costruisci la singola settimana (la riga)
			var days = _buildWeek(date.clone(), month, garbageDays);

			// Aggiungi la settimana creata all'array delle settimane e passa alla settimana successiva
			scope.weeks.push({ 'days': days });
			date.add(1, "w");

			// Controlla se la settimana creata contiene l'ultimo giorno del mese, se lo contiene, stoppa il ciclo
			for (var i = 0; i < days.length; i++) {
				if (days[i].lastDay == true) {
					done = true;
				}
			}
		}
	}

	// Costruisci la settimana (singola riga)
	function _buildWeek(date, month, garbageDays) {

		var days = [],
			lastMonthDay = month.endOf('month').date(),
			checkMidWeek = date.day();

		// Serve a verificare se il primo giorno del mese non è lunedi,
		// se non è lunedì (1), imposta la settimana per partire nel modo giusto
		if (checkMidWeek != 1) {
			if (checkMidWeek == 0) {
				date.subtract(checkMidWeek+6, "d");
			} else {
				date.subtract(checkMidWeek-1, "d");
			}
			
		}

		// Ciclo della settimana, 0 => domenica, 1 => lunedì, ecc.
		for (var i = 0; i < 7; i++) {

			// imposta vari parametri relativi al singolo giorno
			// nome, numero, data
			// se è nel mese corrente o no
			// se è oggi
			// se è l'ultimo giorno del mese
			var tmp = {
				name: date.format("dd").substring(0, 1),
				number: date.date(),
				isCurrentMonth: date.month() === month.month(),
				isToday: date.isSame(new Date(), "day"),
				date: date,
				lastDay: (date.month() == month.month() && date.date() == lastMonthDay ?  true : false)
			};

			// Controlla se l'oggetto garbageDays non è vuoto
			if (Object.keys(garbageDays).length > 0) {
				// Cicla sui giorni di ritiro rifiuti, se corrispondono al giorno del calendario,
				// appendi quali tipi di rifiuti si raccolgono
				for (garbageDay in garbageDays) {
					if (garbageDay == date.format("X") && garbageDays[garbageDay].items.length > 0) {
						tmp.items = garbageDays[garbageDay].items.join(' ');
					}
				}
				
			}

			// aggiungi il giorno alla settimana e passa al giorno successivo
			days.push(tmp);
			date = date.clone();
			date.add(1, "d");
		}


		return days;
	}

});