web-bash
========

web-bash is a simulated terminal interface implemented entirely in your browser. By using the browser, users are able to become accostomed to a command line without putting production systems at risk.

Why would you put your system in danger by letting the intern play with your servers? Buy web-bash and save yourself the trouble.

Author: 
		Tyler Romeo
		Nicholas Bevacqua
		Krzysztof Jordan

List of contents:
	Commands
		cat
		cd
		chgrp
		chmod
		chown
		cp
		commands
		date
		echo
		export
		false
		help
		ln
		ls
		mkdir
		mv
		passwd
		pwd
		rm
		rmdir
		sleep
		touch
		true
		uname
		unset
		useradd
		whoami
	Installation
	Features
		StreamRedirection





=================================================================
							COMMANDS
=================================================================

	cat <files>
	-----------
		Outputs contents of one or more files to the stdout 
		(unless redirected to a different stream)
			files --- file targets


	cd <path>
	--------
		Changes directories to the provided path
			path --- the path to the file


	chgrp <group> <user> 
	--------------------
		Changes the group of the user
			group --- new group to be assigned
			user --- target user

	chmod <permissions> <file>
	--------------------------
		Changes the permissions of the file
			permissions --- 3 digit numerical value ranging from 000 to 777
			file --- target file


	chown <user> <file>
	--------------------
		Change file owner
			user --- new owner of the file
			file --- target file


	cp <file1> <file2>
	------------------
		Copies file1 into file2 
		( only works within the same directory for now )
			file1 --- source file
			file2 --- destination file


	commands
	--------
		Prints a list of all available commands


	date
	----
		Prints the current date to stdout


	echo <args>
	-----------
		Prints onto the stdout, ( unless redirected ) 
		replaces $name with environment variable value
			args --- arguments to be output to the output stream


	export <expressions>
	--------------------
		Declares one or more new environment variables
			expressions --- have the form X=(value)


	false
	-----
		Represents a false value	


	help
	----
		Prints out help information to stdout


	ln <source file> <target link>
	------------------------------
		Creates a symbolic link to the target location
		source file --- file to assign the new link to
		target link --- link to be assigned


	ls [OPTIONS]
	------------
		Shows all the files in current directory,
		[OPTIONS]: 
				-l show long format
				-a include all files starting with a .


	mkdir <directories>
	-------------------
		Creates one or more directories
			directories --- directory names


	mv <file1> <file2>
	------------------
		Moves file1 into file2
		( only works within the same directory for now )
			file1 --- source file 
			file2 --- destination file


	passwd
	------
		Changes the password for the current user


	pwd
	---
		Prints the current directory to stdout


	rm [OPTIONS] <files>
	--------------------
		Removes one or more files 
		( will perform a cascading delete in folders )

		[OPTIONS]:
				-r remove folders


	rmdir <directories>
	-------------------
		Removes one or more empty directories
			directories --- the directories to be deleted


	sleep <number>
	--------------
		Sleeps for a given amount of seconds
			number --- how many seconds


	touch <files ...>
	-----------------
		Refreshes the modified times of the given files
			files --- one or more file targets

	true
	----
		Represents a true value.


	uname [OPTIONS]
	---------------
		Prints system information
		options: 
				-a print all information
				-s print the kernel name
				-n print the network node hostname
				-r print the release version


	unset <args>
	------------
		Unsets one or more environment variables
			args --- environment variable names, separated by space


	useradd <username> [<email>] 
	-----------------
		Adds a new user to the shell environment
			username --- username for the new user
			email --- optional, email to be associated with the user


	whoami
	------
		Prints your username to stdout


=================================================================
							Installation
=================================================================
	Note: all paths are relative to the root folder of webbash

	Configuration file:
		There is a config.ini.sample inside / and change the database
		user and password to the appropriate values.

	Database:
		The sql dump is located inside /maintenance/tables.sql
		Running that this SQL query will set up the database, 
		generate the tables and set up a basic file structure.

	Javascript:
		Compile the javascript (just in case) from command line
		the compilation shell script is located in 
		/maintenance/compiler_webbash.sh



=================================================================
							FEATURES
=================================================================
Stream redirection
	Examples:
		echo hello > test
		cat < test
		ls 2> testerr