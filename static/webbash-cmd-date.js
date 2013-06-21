( function( $, WebBash ) {
	'use strict';

	WebBash.commands.date = function( fds, argc ) {
		if ( argc > 1 ) {
			fd[2].write( "error: date takes no args" );
			return 1;
		}

		var temp = new Date();

		var weekday = new Array(7);
		weekday[0] = "Sun";
		weekday[1] = "Mon";
		weekday[2] = "Tue";
		weekday[3] = "Wed";
		weekday[4] = "Thu";
		weekday[5] = "Fri";
		weekday[6] = "Sat";
		
		var month = new Array(12);
		month[0] = "Jan";
		month[1] = "Feb";
		month[2] = "Mar";
		month[3] = "Apr";
		month[4] = "May";
		month[5] = "Jun";
		month[6] = "Jul";
		month[7] = "Aug";
		month[8] = "Sep";
		month[9] = "Oct";
		month[10] = "Nov";
		month[11] = "Dec";
		
		//Extremely rudimentary timezone detection
		//TODO: make this actually work for zones other than EDT
		var tzoffset = temp.getTimezoneOffset() / 60;
		var tz = "UTC";
		if ( tzoffset === 4 ) {
			tz = "EDT";
		}
		
		var dateStr = weekday[temp.getDay()].toString() + " " + 
			month[temp.getMonth()].toString() + " " +
			temp.getDate().toString() + " ";
		var hours = temp.getHours();
		var hourStr = hours.toString();
		
		//prepended zeroes for prettiness
		if ( hours < 10 ) {
			hourStr = "0" + hours.toString();
		}
		
		var mins = temp.getMinutes();
		var minString = mins.toString();
		
		if( mins < 10 ) {
			minString = "0" + mins.toString();
		}
		
		var sec = temp.getSeconds();
		var secStr = sec.toString();
		
		if( sec < 10) {
			secStr = "0" + sec.toString();
		}
		
		dateStr += hourStr + ":" +
			minString +  ":" + secStr + " " + tz + " " +
			temp.getFullYear().toString() + " ";

		fds[1].write( dateStr );
		return 0;
	};
} )( jQuery, WebBash );
