/**
 * Terminal I/O interaction
 * @constructor
 */
function Terminal() {
	'use strict';

	/**
	 * Controller object to use to process commands
	 * @type {WebBash|WebBashLogin}
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
	 * The current command promise being executed
	 * @type {object}
	 * @private
	 */
	this.promise = null;

	/**
	 * decides whether input text is hidden
	 * @type {boolean}
	 * @private
	 */ 
	this.hiddenMode = false;

    /**
     * toggles text hiding
     */
    this.toggleTextVisibility = function () {
    	this.hiddenMode = !this.hiddenMode;
    }

	/**
	 * Reset the cursor position
	 */
	this.resetCursor = function() {
		$( '#cursor' ).remove();
		$( "body > ul > li:last-child" ).append( $( '<div id="cursor" class="userinput">&nbsp;</div>' ) );

		if ( this.hiddenMode ) {
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
	};

	/**
	 * Display a new prompt line and reset the cursor
	 */
	this.displayPrompt = function() {
		this.promise = null;
		$( "body > ul" ).append( '<li>' + this.prompt + '</li>' );
		this.resetCursor();
	};

	/**
	 * Process a string command and pass it to the controller for execution
	 * @param {string} txt Command entered
	 */
	this.appendOutput = function( txt ) {
		var output = $( '<div id="system_output"></div>' );
		var pattern = /\n/g;

		output.text( txt );
		output.html( output.html().replace( pattern, "<br>") );

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
		} else if ( e.ctrlKey && !e.metaKey && !e.shiftKey && e.which === 68 ) {
			// Ctrl-D: stop input for either the current command or the terminal itself
			e.preventDefault();
			if ( this.promise && this.promise.stdin ) {
				$( '#cursor' ).next().append( '^D' );
				this.promise.stdin.close();
			} else {
				this.controller.shutdown( this );
				this.controller.api.logout();
				// Hopefully something here will close the window
				window.open( '', '_self', '' );
				window.close();
				self.close();
			}
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
			var children = $( '#cursor' ).parent().children( '.userinput' ).not( '.completed' );
			var cmd = children.text();
			cmd = $.trim( cmd.substr( 0, cmd.length - 1 ) );
			children.addClass( 'completed' );

			$( '#cursor' ).prev().append( $( '#cursor' ).text() + '<br >' );

			if ( this.promise && this.promise.stdin ) {
				this.promise.stdin.write( cmd );
			} else if ( cmd.length > 0 ) {
				this.cmdHistory[this.cmdHistory.length] = cmd;
				this.currHistoryPos = this.cmdHistory.length;

				this.promise = this.controller.execute( $.trim( cmd ), this );
				this.promise
					.progress( $.proxy( this.appendOutput, this ) )
					.always( $.proxy( this.displayPrompt, this ) );
			} else {
				this.displayPrompt();
			}
		} else if ( e.which === 222 && e.shiftKey ) {
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
		} else if ( !e.ctrlKey && !e.metaKey ) {
			// Regular text: output to screen
			elem = $( '#cursor' ).prev();
			e.preventDefault();

			var ch = e.getChar();
			if ( ch ) {
				elem.append( ch );
			}
		}

		$( window ).scrollTop( $( document ).height() );
	};

	/**
	 * Bind this terminal to a window and controller
	 * @param {WebBash|WebBashLogin} controller
	 */
	this.bind = function( controller ) {
		if ( this.controller !== null ) {
			this.controller.shutdown.call( this.controller, this );
		}
		this.controller = controller;
		this.controller.startup.call( this.controller, this );
		this.displayPrompt();
	};

	$( window.document ).keydown( $.proxy( this.processInput, this ) );
	$( window ).bind( 'beforeunload', function() {
		this.controller.shutdown.call( this.controller, this );
	} );
	window.setInterval( this.blink, 500 );
	window.setInterval( $.proxy( function() {
		this.controller.shutdown( this );
	}, this ), 10000 );
}

window['Terminal'] = Terminal;
