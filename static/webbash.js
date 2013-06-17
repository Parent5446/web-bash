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
	alert( txt );
}

$( document ).keydown( function( e ) {
	if ( e.keyCode > 31 && e.keyCode < 127 ) {
		var elem = $( '#cursor' ).prev();

		if ( elem.length == 0 || !elem.hasClass( 'userinput' ) ) {
			elem = $( '<div class="userinput"></div>' );
			$( '#cursor' ).before( elem );
		}

		elem.append( String.fromCharCode( e.keyCode ) );
	} else if ( e.keyCode == 8 ) {
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
	}
} );

$( document ).ready( displayPrompt );