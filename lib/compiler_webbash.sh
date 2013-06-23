#!/bin/bash

java -jar compiler.jar \
    --externs closure-compiler/contrib/externs/jquery-1.9.js \
    --externs sjcl.externs.js \
    --js ../static/jquery.eventChar.js \
    --js ../static/webbash-terminal.js \
    --js ../static/webbash-controller.js \
    --js ../static/webbash-stream.js \
    --js ../static/webbash-api.js \
    --js ../static/webbash-cmd-date.js \
    --js ../static/webbash-cmd-api.js \
    --js ../static/webbash-cmd-truefalse.js \
    --compilation_level SIMPLE_OPTIMIZATIONS \
	--js_output_file ../static/webbash-compiled.js