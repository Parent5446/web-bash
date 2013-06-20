function WebBash() {
	'use strict';

	this.environment = {};
	this.api = null;
	this.varPatt = /\w+/i;

	this.executeCommand = function( argv ) {
		var cmd = argv[0];
		argv = this.replaceVariables( argv );

		if ( argv[0] === 'echo' ) {
			argv.shift();
			return argv.join( ' ' );
		} else if ( argv[0] === 'export' ) {
			for ( var i = 1; i < argv.length; ++i ) {
				var splt = argv[i].split( '=', 2 );
				this.environment[splt[0]] = splt[1];
			}
			return '';
		} else if ( typeof WebBash.commands[argv[0]] !== 'undefined' ) {
			var argc = argv.length;
			return WebBash.commands[cmd]( argc, argv, this.environment );
		}

		// TODO: Try the API

		return "error: unknown command " + argv[0];
	};

	this.replaceVariables = function( argv ) {
		for ( var i = 1; i < argv.length; ++i ) {
			for (
				var index = argv[i].indexOf( '$' );
				index >= 0;
				index = argv[i].indexOf( '$', index + 1 )
			) {
				console.log(argv[i][index - 1]);
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
					this.environment[envName] +
					argv[i].substr( index + envName.length + 1 );
			}
		}

		return argv;
	};
}

WebBash.commands = {};
