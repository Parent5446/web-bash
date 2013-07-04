web-bash
========

web-bash is a simulated terminal interface implemented entirely in your browser. By using the browser, users are able to become accostomed to a command line without putting production systems at risk.

Why would you put your system in danger by letting the intern play with your servers? Buy web-bash and save yourself the trouble.


========
Commands
========

cd <path>
--------
   path --- the path to the file


ls [OPTIONS]
------------
	Shows all the files in current directory,
	options: -l show long format
			 -a include all files starting with a .
				

ln <source file> <target link>
------------------------------
	Creates a symbolic link to the target location
	source file --- file to assign the new link to
	target link --- link to be assigned

touch <files ...>
-----------------
	Refreshes the modified times of the given files
	files --- one or more file targets

cat <files>
-----------
	Outputs contents of one or more files to the stdout 
	(unless redirected to a different stream)
	files --- file targets

mkdir <directories>
-------------------
	Creates one or more directories
	directories --- directory names

