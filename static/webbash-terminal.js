/**
 * Terminal I/O interaction
 * @constructor
 */
function Terminal() {
	'use strict';

	/**
	 * Controller object to use to process commands
	 * @type {WebBash}
	 */
	this.controller = null;

	/**
	 * Prompt to display to the user
	 * @type {string}
	 */
	this.prompt = "root@ubuntu> ";

	/**
	 * List of previous commands
	 * @type {Array.<string>}
	 */
	this.cmdHistory = [];

	/**
	 * Current position in the command history
	 * @type {number}
	 */
	this.currHistoryPos = 0;

	/**
	 * Reset the cursor position
	 */
	this.resetCursor = function() {
		$( '#cursor' ).remove();
		$( "body > ul > li:last-child" ).append( $( '<div id="cursor" class="userinput">&nbsp;</div>' ) );

		if ( this.prompt !== 'Password: ' ) {
			$( '#cursor' ).before( $( '<div class="userinput"></div>' ) );
			$( '#cursor' ).after( $( '<div class="userinput></div>' ) );			
		} else {		
			$( '#cursor' ).before( $( '<div id="hiddentext" class="userinput"></div>' ) );
			$( '#cursor' ).after( $( '<div id="hiddentext" class="userinput"></div>' ) );
		}
		$( window ).scrollTop( $( document ).height() );
	};

	/**
	 * clear the page content
	 */
	this.clear = function() {
		$( "body > ul" ).empty();
	}

	/**
	 * Display a new prompt line and reset the cursor
	 */
	this.displayPrompt = function() {
		$( "body > ul" ).append( '<li>' + this.prompt + '</li>' );
		this.resetCursor();
	};

	/**
	 * Process a string command and pass it to the controller for execution
	 * @param {string} txt Command entered
	 */
	this.appendOutput = function( txt ) {
		var output = $( '<div id="system_output"></div>' );

		output.text( txt );
		$( "body > ul > li:last-child" ).append( output );
		this.resetCursor();
	};

	/**
	 * Toggle the cursor to blink on or off
	 */
	this.blink = function() {
		$( '#cursor' ).toggleClass( 'blink' );
	};

	/**
	 * Move the cursor one position to the left
	 */
	this.moveCursorLeft = function() {
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
	};

	/**
	 * Move the cursor one position to the right
	 */
	this.moveCursorRight = function() {
		var cursor = $( '#cursor' ),
			firstChar, cursorChar, rightText,
			leftElem = cursor.prev(),
			rightElem = cursor.next();

		if ( rightElem.length === 0 || !rightElem.hasClass( 'userinput' ) ) {
			return false;
		}

		rightText = rightElem.text();
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
	};

	/**
	 * Cycle through the history and update the prompt
	 * @param {number} num Number of spaces (and direction) to move in history
	 */
	this.cycleHistory = function( num ) {
		var cmd = $( '#cursor' ).parent().children( '.userinput' ).text();
		this.cmdHistory[this.currHistoryPos] = cmd.substr( 0, cmd.length - 1 );

		var newPos = this.currHistoryPos + num;
		if ( newPos < this.cmdHistory.length && newPos >= 0 ) {
			this.currHistoryPos = newPos;
			var cursor = $( '#cursor' );
			cursor.next().text( '' );
			cursor.html( '&nbsp;' );
			cursor.prev().text( this.cmdHistory[this.currHistoryPos] );
		}
	};

	/**
	 * Process a single input character
	 * @param {jQuery.Event} e Keydown event
	 */
	this.processInput = function( e ) {
		var elem;

		if ( e.which === 37 ) {
			// Left arrow key: move cursor
			e.preventDefault();
			this.moveCursorLeft();
		} else if ( e.which === 39 ) {
			// Right arrow key: move cursor
			e.preventDefault();
			this.moveCursorRight();
		} else if ( e.which === 38 ) {
			// Up arrow key: scroll history
			e.preventDefault();
			this.cycleHistory( -1 );
		} else if ( e.which === 40 ) {
			// Down arrow key: scroll history
			e.preventDefault();
			this.cycleHistory( 1 );
		} else if ( e.which === 35 ) {
			// End key: move to end of line
			while ( this.moveCursorRight() ) {
				continue;
			}
		} else if ( e.which === 36 ) {
			// Home key: move to beginning of line
			while ( this.moveCursorLeft() ) {
				continue;
			}
		} else if ( e.ctrlKey && !e.metaKey && !e.shiftKey && e.which === 67 ) {
			// Ctrl-C: break input and reprompt
			e.preventDefault();
			$( '#cursor' ).next().append( '^C' );
			this.displayPrompt();
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
				this.cmdHistory[this.cmdHistory.length] = cmd;
				this.currHistoryPos = this.cmdHistory.length;
			}

			$( '#cursor' ).prev().append( $( '#cursor' ).text() );
			$( '#cursor' ).next().after( $( ' <br> ') );

			this.controller.execute( $.trim( cmd ), this )
				.progress( $.proxy( this.appendOutput, this ) )
				.always( $.proxy( this.displayPrompt, this ) );
		} else if ( e.which === 222 && e.shiftKey) {
			// double quote: Needs special handling
			e.preventDefault();
			elem = $( '#cursor' ).prev();
			elem.append( '\"' );
			this.moveCursorRight( 1 );
		} else if ( e.which === 222 ) {
			// Single quote: Needs special handling
			e.preventDefault();
			elem = $( '#cursor' ).prev();
			elem.append( '\'' );
			this.moveCursorRight( 1 );
		} else {
			// Regular text: output to screen
			elem = $( '#cursor' ).prev();

			var ch = e.getChar();
			if ( ch ) {
				elem.append( ch );
			}
		}

		$( window ).scrollTop( $( document ).height() );
	};

	/**
	 * Bind this terminal to a window and controller
	 * @param {WebBash} controller
	 */
	this.bind = function( controller ) {
		if ( this.controller !== null ) {
			$.proxy( this.controller.shutdown, this.controller )( this );
		}
		this.controller = controller;
		$.proxy( this.controller.startup, this.controller )( this );
		this.displayPrompt();
	};

	$( window.document ).keydown( $.proxy( this.processInput, this ) );
	$( window ).bind( 'beforeunload', function() {
		$.proxy( this.controller.shutdown, this.controller )( this );
	} );
	window.setInterval( this.blink, 500 );
	window.setInterval( $.proxy( function() {
		this.controller.shutdown( this );
	}, this ), 10000 );
}

window['Terminal'] = Terminal;
