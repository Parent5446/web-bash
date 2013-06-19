var prompt = "root@ubuntu> ";
var ctrlDown = false;
var blinkState = false;

var history = new Array();
var currHistoryPos;

function resetCursor()
 {
	$( '#cursor' ).remove();
	$( "body > ul > li:last-child" ).append( $( '<div id="cursor">&nbsp;</div>' ) );
	$( '#cursor' ).before( $( '<div class="userinput"></div>' ) );
	$( '#cursor' ).after( $( '<div class="userinput"></div>' ) );
}

function displayPrompt() 
{
	$( "body > ul" ).append( '<li>' + prompt + '</li>' );
	resetCursor();
}

function executeCommand( txt ) 
{
}

function blink() 
{
	if( blinkState === true )
	{
		$( '#cursor' ).css( "opacity", 0 );
	}
	else 
	{
		$( '#cursor' ).css( "opacity", 1 ); 
	}
	blinkState = !blinkState;		
}

function getCommand()
{
	var cursor = $( '#cursor' );

	var left = cursor.prev();
	var right = cursor.next();
	var cmd = '';

	if ( left.length > 0 && left.hasClass( 'userinput' ) ) 
	{
		cmd = left.text();
	}
	if( right.length > 0 && right.hasClass( 'userinput' ) )
	{
		cmd += right.text();
	}

	return cmd;
}

function moveCursorLeft( num ) 
{
	for( var i = 0; i < num; ++i)
	{
		var cursor = $( '#cursor' );	

		var lastChar = '';
		var leftElem = $( '#cursor' ).prev();
	
		if( leftElem.length > 0 && leftElem.hasClass( 'userinput' ) ) 
		{
			var leftText = leftElem.text();
			lastChar = leftText.substring( leftText.length - 1 );
			leftElem.text( leftText.substring( 0, leftText.length - 1 ) );
		}

		var rightElem = cursor.next();

		if( rightElem.length > 0 && rightElem.hasClass( 'userinput' ) )
		{
			var rightText = rightElem.text();
			rightElem.text( lastChar + rightText );
		}
	}
}

function moveCursorRight( num ) 
{
	for( var i = 0; i < num; ++i)
	{
		var cursor = $( '#cursor' );	

		var firstChar = '';
		var rightElem = cursor.next();

		if( rightElem.length > 0 && rightElem.hasClass( 'userinput' ) )
		{
			var rightText = rightElem.text();
			firstChar = rightText.substring( 0, 1 ); 
			rightElem.text( rightText.substring( 1, rightText.length ) );
		}
	
		var leftElem = $( '#cursor' ).prev();
	
		if( leftElem.length > 0 && leftElem.hasClass( 'userinput' ) ) 
		{
			leftElem.text( leftElem.text() + firstChar );
		}	
	}
}

function cycleHistory( num )
{
	var newPos = currHistoryPos + num;
	if( newPos < history.length && newPos >= 0 )
	{
		currHistoryPos = newPos;
		
		$( '#cursor' ).next().text( '' );
		$( '#cursor' ).prev().text( history[currHistoryPos] );
	}	
	else if( newPos === history.length || newPos === -1 )
	{
		currHistoryPos = history.length;
		$( '#cursor' ).next().text( '' );
		$( '#cursor' ).prev().text( '' );
	}
}

$( document ).keydown( function( e ) 
{
	var elem;
	if( e.keyCode === 37 )
	{
		moveCursorLeft( 1 );
	}
	else if( e.keyCode === 39 )
	{
		moveCursorRight( 1 );
	}
	else if( e.keyCode === 38 )
	{
		cycleHistory( -1 );
	}
	else if( e.keyCode === 40 )
	{
		cycleHistory( 1 );
	}
	else if( ctrlDown && e.keyCode === 67 ) 
	{
		$( '#cursor' ).next().append( '^C' );
		displayPrompt();
	} 
	else if( e.keyCode === 46 )
	{
		elem = $( '#cursor' ).next();
		if(elem.length !== 0 && elem.hasClass('userinput'))
		{
			if( elem.text().length === 1 )
			{
				elem.remove();
			}
			else
			{
				elem.text( elem.text().substring(1) );
			}
		}
	}
	else if( e.keyCode > 31 && e.keyCode < 97 ) 
	{
		elem = $( '#cursor' ).prev();
		elem.append( String.fromCharCode( e.keyCode ) );
		moveCursorRight( 1 );
	} 
	else if( e.keyCode === 8 ) 
	{
		e.preventDefault();
		elem = $( '#cursor' ).prev();
		if ( elem.length > 0 && elem.hasClass( 'userinput' ) ) 
		{
			if(elem.text().length > 1) 
			{
				elem.text( elem.text().slice(0, -1) );	
			}	
			else 
			{
				elem.remove();
			}
		}
	}
	else if( e.keyCode === 13 ) 
	{
		var cmd = getCommand();
		$( 'cursor' ).next().after( $( ' <br> ') );

		history[history.length] = cmd;
		currHistoryPos = history.length;

		executeCommand( cmd );
		displayPrompt();
	} 
	else if( e.keyCode === 17 ) 
	{
		ctrlDown = true;
	}


	$( window ).scrollTop( $( document ).height() );
} );

$( document ).keyup( function( e ) 
{
	if ( e.keyCode === 17 ) 
	{
		ctrlDown = false;
	}
} );

$( document ).ready( function() {
	displayPrompt();
	window.setInterval( blink, 500 );
} );