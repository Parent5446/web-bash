function WebBash() {
	'use strict';

	this.environment = { '?': 0 };
	this.api = null;
	this.varPatt = /[\w\?\-\!]+/i;

	this.executeCommand = function( argv, output ) {
		var cmd = argv[0];
		argv = this.replaceVariables( argv );

		this.environment['_'] = argv[argv.length - 1];

		if ( argv.length <= 0 ) {
			// No command given
		} else if ( argv[0] === 'eval' ) {
			argv.shift();
			if ( argv.length > 0 ) {
				this.environment['?'] = this.executeCommand( argv, output );
			} else {
				this.environment['?'] = 0;
			}
		} else if ( argv[0] === 'echo' ) {
			argv.shift();
			output.append( argv.join( ' ' ) );
			this.environment['?'] = 0;
		} else if ( argv[0] === 'export' ) {
			for ( var i = 1; i < argv.length; ++i ) {
				var splt = argv[i].split( '=', 2 );
				this.environment[splt[0]] = splt[1];
			}
			this.environment['?'] = 0;
		} else if ( typeof WebBash.commands[argv[0]] !== 'undefined' ) {
			var fds = [ new IoStream(), new IoStream(), new IoStream() ];
			fds[1].flush = function( text ) {
				output.append( text );
			}
			fds[2].flush = function( text ) {
				output.append( text );
			}

			var argc = argv.length;
			this.environment['?'] = WebBash.commands[cmd]( fds, argc, argv, this.environment );
		} else if ( argv[0] !== '' ) {
			output.append( "error: unknown command " + argv[0] );
			this.environment['?'] = 127;
		}
	};

	this.replaceVariables = function( argv ) {
		for ( var i = 1; i < argv.length; ++i ) {
			for (
				var index = argv[i].indexOf( '$' );
				index >= 0;
				index = argv[i].indexOf( '$', index + 1 )
			) {
				if ( index !== 0 && argv[i][index - 1] === '\\' ) {
					argv[i] = argv[i].substr( 0, index - 1 ) + argv[i].substr( index );
					continue;
				}

				var envName = this.varPatt.exec( argv[i].substr( index + 1 ) )[0];
				if ( envName === null ) {
					continue;
				}

				if ( typeof this.environment[envName] === 'undefined' ) {
					this.environment[envName] = '';
				}

				argv[i] = argv[i].substr( 0, index ) +
					this.environment[envName].toString() +
					argv[i].substr( index + envName.length + 1 );
			}
		}

		return argv;
	};
}

WebBash.commands = {};
