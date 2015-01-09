sails-migration-control
=======================

## Purpose

sails-migration-control provides an easy way to manage database migrations with sails, although lets 
you run any kind of script **encoded in utf8**. You do not have to worry about which scripts 
were or were not installed in each version.


## Install

	1. Copy the migrations.js file inside /config
	
	2. Create a Migration.js model:
	
		sails generate model migration
		
	3. Create a new folder migrations inside /config (Not mandatory, you put your scripts 
	where you want, but all in one location)
	
	4. Indicate this directory in the global configuration variables:
	
		migrations: {
			dir: __dirname + '/../migrations'
		}
		
	5. Finally, invoke it from the bootstrap.js file:
		
		var migrations = require('./migrations.js');
		migrations.doMigrations(sails.config.migrations, cb);
		

## API
	
	migrations.doMigrations(options, callback)
		* options -> Object
		* callback -> Function


## Use

	Put your scripts inside the migrations folder or the one which you choose and lift the 
	server.
	
### Example of script
	
	Model.native(function(err, collection) {
		collection.ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 }, function(err, result) {
			if (err) callback(err);
		});
	});