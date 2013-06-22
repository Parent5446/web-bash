/**
 * @fileoverview Externs for SJCL
 *
 * This file has the externs for the SJCL library. This is not part of the SJCL
 * project and was made specifically for WebBash. Make sure to update it if more
 * parts of SJCL are used.
 *
 * @externs
 */

 /**
  * @type {Object}
  */
 var sjcl = {};
 
 /**
  * @type {Object}
  */
 sjcl.random = {};
 
 /**
  * @type {Object}
  */
 sjcl.misc = {};
 
 /**
  * @param {number} numWords
  * @param {number} paranoia
  * @return {!Array.<string>}
  */
sjcl.random.randomWords = function( numWords, paranoia ) {};

/**
 * @constructor
 * @param {Array.<string>|string} salt
 * @return {!Object.<Array.<string>>}
 */
sjcl.misc.hmac = function( salt ) {};

/**
 * @param {string} password
 * @param {Object} settings
 */
sjcl.misc.cachedPbkdf2 = function( password, settings ) {};

sjcl.startCollectors = function() {};

/**
 * @param {string} event
 * @param {function(number)} callback
 */
sjcl.random.addEventListener = function( event, callback ) {};