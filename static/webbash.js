(function( $ ) {
	'use strict';

	var prompt = "root@ubuntu> ";
	var cmdHistory = [];
	var currHistoryPos;

	function resetCursor() {
		$( '#cursor' ).remove();
		$( "body > ul > li:last-child" ).append( $( '<div id="cursor" class="userinput">&nbsp;</div>' ) );
		$( '#cursor' ).before( $( '<div class="userinput"></div>' ) );
		$( '#cursor' ).after( $( '<div class="userinput"></div>' ) );
	}

	function displayPrompt() {
		$( "body > ul" ).append( '<li>' + prompt + '</li>' );
		resetCursor();
	}

	function command_split( txt ) {
		var cmd = "";
		var arr = [];
		var inString = false;
		var backslash = false;

		for ( var i = 0; i < txt.length; i++ ) {
			if ( txt[i] === ' ' && inString ) {
				cmd += txt[i];
			} else if ( txt[i] === ' ' && !inString ) {
				if ( cmd.length > 0 ) {
					arr.push(cmd);
					cmd = "";
				}
				continue;
			} else if ( txt[i] === '\\' ) {
				if ( backslash ) {
					cmd += '\\';
				} else {
					backslash = true;
					continue;
				}
			} else if (txt[i] === '\'') {
				if ( backslash ) {
					cmd += '\'';
				} else if ( !inString ) {
					inString = true;
				} else {
					inString = false;
				}
			} else {
				cmd += txt[i];
				backslash = false;
			}
		}

		cmd = $.trim( cmd );
		if ( cmd !== '' ) {
			arr.push( cmd );
		}

		return arr;
	}

	function executeCommand( txt ) {
		txt = $.trim(txt);
		$( "body > ul > li:last-child" ).append( $( '<div class="system_output"></div>' ) );
		var last = $( '.system_output' ).last();
		// insert system results inside last
		var split_text = command_split(txt);

		// Log the command to the console
		var debugArray = "[";
		for ( var v = 0; v < split_text.length; v++ ) {
			debugArray += '\"' + split_text[v] + '\"';
			if ( v !== split_text.length - 1 ) {
				debugArray += ", ";
			}
		}
		debugArray += "]";
		console.log( debugArray );

		// Process the command
		if ( split_text.length === 0 ) {
			// Empty command
			return;
		} else if ( split_text[0] === "date" ) {
			if ( split_text.length > 1 ) {
				last.text("error: date takes no args");
			} else {
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
				last.text( dateStr );
			}
		} else {
			last.text("error: invalid command " + split_text[0] );
		}
	}

	function blink() {
		$( '#cursor' ).toggleClass( 'blink' );
	}

	function moveCursorLeft() {
		var cursor = $( '#cursor' );

		var lastChar, cursorChar,
			leftElem = cursor.prev(),
			rightElem = cursor.next();

		if ( leftElem.length === 0 || !leftElem.hasClass( 'userinput' ) ) {
			return false;
		}

		var leftText = leftElem.text();
		if ( leftText.length === 0 ) {
			return false;
		}

		lastChar = leftText.substr( leftText.length - 1 );
		cursorChar = cursor.text();

		if ( rightElem.length === 0 && cursorChar !== '&nbsp;' ) {
			rightElem = $( '<div class="userinput"></div>' );
			cursor.after( rightElem );
		}

		leftElem.text( leftText.substring( 0, leftText.length - 1 ) );
		cursor.text( lastChar );
		if ( cursorChar !== '&nbsp;' ) {
			rightElem.prepend( cursorChar );
			return true;
		} else {
			return false;
		}
	}

	function moveCursorRight() {
		var cursor = $( '#cursor' );

		var firstChar, cursorChar,
			leftElem = cursor.prev(),
			rightElem = cursor.next();

		if ( rightElem.length === 0 || !rightElem.hasClass( 'userinput' ) ) {
			return false;
		}

		var rightText = rightElem.text();
		if ( rightText.length === 0 ) {
			return false;
		}

		firstChar = rightText[0];
		cursorChar = cursor.text();

		if ( rightElem.length === 0 ) {
			cursor.html( '&nbsp;' );
			return false;
		} else {
			rightElem.text( rightText.substr( 1 ) );
			cursor.text( firstChar );
			leftElem.append( cursorChar );
			return true;
		}
	}

	function cycleHistory( num ) {
		var cmd = $( '#cursor' ).parent().children( '.userinput' ).text();
		cmdHistory[currHistoryPos] = cmd.substr( 0, cmd.length - 1 );

		var newPos = currHistoryPos + num;
		if ( newPos < cmdHistory.length && newPos >= 0 ) {
			currHistoryPos = newPos;
			var cursor = $( '#cursor' );
			cursor.next().text( '' );
			cursor.html( '&nbsp;' );
			cursor.prev().text( cmdHistory[currHistoryPos] );
		}
	}

	$( document ).keydown( function( e ) {
		var elem;

		if ( e.which === 37 ) {
			// Left arrow key: move cursor
			moveCursorLeft();
		} else if ( e.which === 39 ) {
			// Right arrow key: move cursor
			moveCursorRight();
		} else if ( e.which === 38 ) {
			// Up arrow key: scroll history
			cycleHistory( -1 );
		} else if ( e.which === 40 ) {
			// Down arrow key: scroll history
			cycleHistory( 1 );
		} else if ( e.which === 35 ) {
			// End key: move to end of line
			while ( moveCursorRight() ) {
				continue;
			}
		} else if ( e.which === 36 ) {
			// Home key: move to beginning of line
			while ( moveCursorLeft() ) {
				continue;
			}
		} else if ( e.ctrlKey && !e.metaKey && !e.shiftKey && e.which === 67 ) {
			// Ctrl-C: break input and reprompt
			e.preventDefault();
			$( '#cursor' ).next().append( '^C' );
			displayPrompt();
		} else if ( e.which === 46 ) {
			// Delete key
			elem = $( '#cursor' );
			var next = elem.next();
			if ( next.length !== 0 && next.hasClass( 'userinput' ) ) {
				var nextText = next.text();
				if ( nextText.length !== 0 ) {
					elem.text( nextText.substr( 0, 1 ) );
					next.text( nextText.substr( 1 ) );
				} else {
					elem.html( '&nbsp;' );
				}
			} else {
				elem.html( '&nbsp;' );
			}
		} else if ( e.which === 8 ) {
			// Backspace key
			e.preventDefault();
			elem = $( '#cursor' ).prev();
			if ( elem.length > 0 && elem.hasClass( 'userinput' ) ) {
				elem.text( elem.text().slice( 0, -1 ) );
			}
		} else if ( e.which === 13 ) {
			// Enter key: submit command
			var cmd = $( '#cursor' ).parent().children( '.userinput' ).text();
			cmd = cmd.substr( 0, cmd.length - 1 );

			if ( cmd.length > 0 ) {
				cmdHistory[cmdHistory.length] = cmd;
				currHistoryPos = cmdHistory.length;
			}

			$( '#cursor' ).prev().append( $( '#cursor' ).text() );
			$( '#cursor' ).next().after( $( ' <br> ') );
			executeCommand( cmd );
			displayPrompt();
		} else if ( e.which === 17 ) {
			// Ctrl: Set state to detect special chars
			ctrlDown = true;
		} else if ( e.which === 16 ) {
			// Shift: Set state to detect uppercase
			shiftDown = true;
		} else if ( e.which === 222 ) {
			// Single quote: Needs special handling
			e.preventDefault();
			elem = $( '#cursor' ).prev();
			elem.append( '\'' );
			moveCursorRight( 1 );
		} else {
			// Regular text: output to screen
			elem = $( '#cursor' ).prev();

			var ch = e.getChar();
			console.log( ch );
			if ( ch ) {
				elem.append( ch );
			}
		}

		$( window ).scrollTop( $( document ).height() );
	} );

	$( document ).ready( function() {
		displayPrompt();
		window.setInterval( blink, 500 );
	} );
} ( jQuery ) );