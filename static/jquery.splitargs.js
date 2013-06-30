/**
 * Split a command into an argument array
 * @private
 * @param {string} txt
 * @return {Array.<string>}
 */
jQuery.fn.splitArgs = function( txt ) {
	'use strict';

	var cmd = "",
		split_text = [],
		inQuote = false,
		inDoubleQuote = false,
		backslash = false;

	for ( var i = 0; i < txt.length; i++ ) {
		if ( txt[i] === ' ' && ( inQuote || inDoubleQuote ) ) {
			cmd += txt[i];
		} else if ( txt[i] === ' ' && !( inQuote || inDoubleQuote ) ) {
			if ( cmd.length > 0 ) {
				split_text.push(cmd);
				cmd = "";
			}
			continue;
		} else if ( txt[i] === '\\' ) {
			if ( backslash || inQuote ) {
				cmd += '\\';
				backslash = false;
			} else {
				backslash = true;
			}
		} else if ( txt[i] === '\'' ) {
			if ( backslash ) {
				cmd += '\'';
				backslash = false;
			} else if ( inDoubleQuote ) {
				cmd += '\'';
			} else {
				inQuote = !inQuote;
			}
		} else if ( txt[i] === '\"' ) {
			if ( backslash ) {
				cmd += '\"';
				backslash = false;
			} else if ( inQuote ) {
				cmd += '\"';
			} else {
				inDoubleQuote = !inDoubleQuote;
			}
		} else if ( txt[i] === '$' && inQuote ) {
			cmd += '\\$';
		} else {
			cmd += txt[i];
			backslash = false;
		}
	}

	cmd = $.trim( cmd );
	if ( cmd !== '' ) {
		split_text.push( cmd );
	}

	return split_text;
};