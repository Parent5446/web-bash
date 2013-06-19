var prompt = "root@ubuntu> "
var ctrlDown = false;
var blinkState = false;


var history = new Array();
var index = 0;

function resetCursor()
 {
	$( '#cursor' ).remove();
	$( "body > ul > li:last-child" ).append( $( '<div id="cursor">&nbsp;</div>' ) );
}

function displayPrompt() 
{
	$( "body > ul" ).append( '<li>' + prompt + '</li>' );
	resetCursor();
}

function executeCommand( txt ) 
{
	history[index++] = txt;
}

function blink() 
{
	if( blinkState )
	{
		$( '#cursor' ).css( "opacity", 0 );
	}
	else 
	{
		$( '#cursor' ).css( "opacity", 1 ); 
	}
	blinkState = !blinkState;		
}

function moveCursorLeft( num ) 
{
	for( i = 0; i < num; ++i)
	{
		var elem = $( '#cursor' ).prev();
		if ( elem.length != 0 && elem.hasClass( 'userinput' ) ) 
		{
			// previous elements so move cursor left
			if(elem.text() && elem.text().length > 1)
			{
				var elem2 = $( '<div class="userinput"></div>' );
				elem.before(elem2);
				var lastChar = elem.text().substring(elem.text().length-1);
				var beginningOfString = elem.text().substring(0, elem.text().length-1);

				elem2.text(beginningOfString);
				elem.text(lastChar);
			}
			var cursor = $( '#cursor' );
			cursor.remove();
			elem.before(cursor);
		}
	}
}

function moveCursorRight( num ) 
{
	for( i = 0; i < num; ++i)
	{
		var elem = $( '#cursor' ).next();

		if ( elem.length != 0 && elem.hasClass( 'userinput' ) ) 
		{
			// next elements so move cursor right
			if(elem.text() && elem.text().length > 1)
			{
				var elem2 = $( '<div class="userinput"></div>' );
				elem.after(elem2);
				var firstChar = elem.text().substring(0, 1);
				var restOfString = elem.text().substring(1);

				elem2.text(restOfString);
				elem.text(firstChar);
			}
			var cursor = $( '#cursor' );
			cursor.remove();
			elem.after(cursor);
		}
	}
}

$( document ).keydown( function( e ) 
{
	if ( ctrlDown && e.keyCode == 67 ) 
	{
		$( 'ul > li' ).last().append( '^C' );
		displayPrompt();
	} 
	else if( e.keyCode == 37 )
	{
		moveCursorLeft( 1 );
	}
	else if (e.keyCode == 39)
	{
		moveCursorRight( 1 );
	}
	else if(e.keyCode == 46)
	{
		var elem = $( '#cursor' ).next();
		if(elem.length != 0 && elem.hasClass('userinput'))
		{
			if(elem.text().length == 1)
			{
				elem.remove();
			}
			else
			{
				elem.text( elem.text().substring(1) );
			}
		}
	}
	else if ( e.keyCode > 31 && e.keyCode < 97 ) 
	{
		var elem = $( '#cursor' ).prev();

		if ( elem.length == 0 || !elem.hasClass( 'userinput' ) )
		{
			elem = $( '<div class="userinput"></div>' );
			$( '#cursor' ).before( elem );
		}
		elem.append( String.fromCharCode( e.keyCode ) );
	} 
	else if ( e.keyCode == 8 ) 
	{
		e.preventDefault();
		var elem = $( '#cursor' ).prev();
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
	else if ( e.keyCode == 13 ) 
	{
		var elem = $( '#cursor' ).prev();
		var elem2 = $( '#cursor' ).nextAll();

		var cmd = '';
		if ( elem.length > 0 && elem.hasClass( 'userinput' ) ) 
		{
			cmd = elem.text();
		}
		if( elem2.length > 0 && elem2.hasClass( 'userinput' ) )
		{
			var rest = elem2.text();
			moveCursorRight( rest.length );
			cmd += rest;
		}

		elem = $( '#cursor' ).prev();
		elem.after( $( '<br>' ) );
		alert(cmd);
		executeCommand( cmd );
		displayPrompt();
	} 
	else if ( e.keyCode == 17 ) 
	{
		ctrlDown = true;
	}

	$( window ).scrollTop( $( document ).height() );
} );

$( document ).keyup( function( e ) 
{
	if ( e.keyCode == 17 ) 
	{
		ctrlDown = false;
	}
} );

$( document ).ready( displayPrompt )
{
	window.setInterval( blink, 500 );
}