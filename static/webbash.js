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

function command_split(txt)
{
	var cmd = "";
	var arr = []
	var inString = false;
	var backslash = false;
	for(var i = 0; i < txt.length; i++)
	{
		if(txt[i] == ' ' && inString)
			cmd += txt[i];
		else if(txt[i] == ' ' && !inString)
		{
			if(cmd.length > 0)
			{
				arr.push(cmd);
				cmd = "";
			}
			continue;
		}
		else if(txt[i] == '\\')
		{
			if(backslash)
			{
				cmd += '\\';
			}
			else
			{
				backslash = true;
				continue;
			}
		}
		else if(txt[i] == '\'')
		{
			if(backslash)
			{
				cmd += '\'';
			}
			else if (!inString)
			{
				inString = true;
			}
			else
			{
				inString = false;
			}
		}
		else
		{
			cmd += txt[i];
			backslash = false;
		}
	}
	
	cmd = $.trim(cmd);
	if(cmd != '')
		arr.push(cmd);
	return arr;
}

var built_in_commands = ["DATE", "ALIAS", "CD", "ECHO", "EXIT", "FALSE", "TRUE", "HELP", "PRINTF", "EVAL", "PWD", "SET", "TEST", "UNSET", "WHOAMI", "SLEEP"];
function executeCommand( txt ) 
{
	txt = $.trim(txt);
	$( "body > ul > li:last-child" ).after( $( '<li><div class="system_output">system output here</div></li>' ) );
	var last = $( '.system_output' ).last();
	// insert system results inside last
	var split_text = command_split(txt);
	
	var debug_split_text_array = "[";
	for(var v = 0; v < split_text.length; v++)
	{
		debug_split_text_array += '\"'+split_text[v]+'\"';
		if(v != split_text.length-1)
		{
			debug_split_text_array += ", ";
		}
	}
	debug_split_text_array += "]";
	console.log(debug_split_text_array);
	
	if(split_text.length == 0)
		return;
		
	if(split_text[0] == "DATE")
	{
		if(split_text.length > 1)
		{
			last.text("error: date takes no args");
		}
		else
		{
			var temp = new Date();
			// fix formatting.
			var dateStr = temp.getMonth().toString() + "-" + 
                  temp.getDate().toString() + "-" + 
				  temp.getFullYear().toString() + " ";
				  var hours = temp.getHours();
				  if(hours == 0)
					hours = 12;
                  dateStr += hours.toString() +  ":" +
                  temp.getMinutes().toString() +  ":" +
                  temp.getSeconds().toString();
			last.text(dateStr);
		}
	}
	else
	{
		last.text("error: invalid command "+split_text[0]);
	}
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
	var cursor = $( '#cursor' );	

	var lastChars = '';
	var leftElem = $( '#cursor' ).prev();
	
	if( leftElem.length > 0 && leftElem.hasClass( 'userinput' ) ) 
	{
		var leftText = leftElem.text();
		var moveAmount = (leftText.length >= num)? num : leftText.length;

		lastChars = leftText.substring( leftText.length - moveAmount, leftText.length );
		leftElem.text( leftText.substring( 0, leftText.length - moveAmount ) );
	}

	var rightElem = cursor.next();

	if( rightElem.length > 0 && rightElem.hasClass( 'userinput' ) )
	{
		var rightText = rightElem.text();
		rightElem.text( lastChars + rightText );
	}
}

function moveCursorRight( num ) 
{
	var cursor = $( '#cursor' );	

	var firstChars = '';
	var rightElem = cursor.next();

	if( rightElem.length > 0 && rightElem.hasClass( 'userinput' ) )
	{
		var rightText = rightElem.text();
		var moveAmount = (rightText.length >= num)? num : rightText.length;

		firstChar = rightText.substring( 0, moveAmount ); 
		rightElem.text( rightText.substring( moveAmount, rightText.length ) );
	}
	
	var leftElem = $( '#cursor' ).prev();
	
	if( leftElem.length > 0 && leftElem.hasClass( 'userinput' ) ) 
	{
		leftElem.text( leftElem.text() + firstChar );
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
	else
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
	else if(e.keyCode == 222)
	{
		e.preventDefault();
		elem = $( '#cursor' ).prev();
		elem.append( '\'' );
		moveCursorRight( 1 );
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
			elem.text( elem.text().slice(0, -1) );	
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