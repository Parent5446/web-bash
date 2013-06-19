var prompt = "root@ubuntu> "

function resetCursor() {
	$( '#cursor' ).remove();
	$( "body > ul > li:last-child" ).append( $( '<div id="cursor">&nbsp;</div>' ) );
}

function displayPrompt() {
	$( "body > ul" ).append( '<li>' + prompt + '</li>' );
	resetCursor();
}

function executeCommand( txt ) {
	//alert( txt );
}

ctrlDown = false;

$( document ).keydown( function( e ) {
	if ( ctrlDown && e.keyCode == 67 ) {
		$( 'ul > li' ).last().append( '^C' );
		displayPrompt();
	} else if ( e.keyCode > 31 && e.keyCode < 127 ) {
		var elem = $( '#cursor' ).prev();

		if ( elem.length == 0 || !elem.hasClass( 'userinput' ) ) {
			elem = $( '<div class="userinput"></div>' );
			$( '#cursor' ).before( elem );
		}

		elem.append( String.fromCharCode( e.keyCode ) );
	} else if ( e.keyCode == 8 ) {
		e.preventDefault();
		var elem = $( '#cursor' ).prev();
		if ( elem.length > 0 && elem.hasClass( 'userinput' ) ) {
			elem.text( elem.text().slice(0, -1) );	
		}
	} else if ( e.keyCode == 13 ) {
		var elem = $( '#cursor' ).prev();
		var cmd = '';
		if ( elem.length > 0 && elem.hasClass( 'userinput' ) ) {
			cmd = elem.text();
		}

		$( '#cursor' ).before( $( '<br>' ) );
		executeCommand( cmd );
		displayPrompt();
	} else if ( e.keyCode == 17 ) {
		ctrlDown = true;
	}

	$( window ).scrollTop( $( document ).height() );
} );

$( document ).keyup( function( e ) {
	if ( e.keyCode == 17 ) {
		ctrlDown = false;
	}
} );

$( document ).ready( displayPrompt );