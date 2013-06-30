#!/bin/bash

java -jar ../lib/compiler.jar \
	--accept_const_keyword \
	--process_jquery_primitives \
	--use_types_for_optimization \
    --externs ../lib/jquery-1.9-externs.js \
    --js ../static/jquery.eventChar.js \
    --js ../static/jquery.realpath.js \
	--js ../static/jquery.pad.js \
	--js ../static/jquery.getopt.js \
	--js ../static/jquery.splitArgs.js \
    --js ../static/webbash-terminal.js \
    --js ../static/webbash-controller.js \
    --js ../static/webbash-controller-login.js \
    --js ../static/webbash-stream.js \
    --js ../static/webbash-api.js \
    --js ../static/webbash-cmd-internal.js \
    --js ../static/webbash-cmd-api.js \
    --compilation_level ADVANCED_OPTIMIZATIONS \
    --js_output_file ../static/webbash-compiled.js
