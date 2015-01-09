'use strict';

var fs = require('fs');

module.exports = {	
	doMigrations: function (config, cb) {

		async.waterfall([
			function (callback) {
				readMigrations(config.dir, callback);
			},
			function (files, callback) {
				checkMigrations(files, callback);
			},
			function (pending, callback) {
				executeMigrations(config.dir, pending, callback);
			}
		], function (err, result) {
			if (err) {
				return cb(err);
			}
			return cb(null, result);
		});
	}
};

function readMigrations(dir, callback) {
	fs.readdir(dir, function (err, files) {
		if (err) {
			return callback(err);
		}
		return callback(null, files);
	});
}

function checkMigrations(files, callback) {
	var pending = [];
	var executed = [];

	Migration.find()
	.then(function (migrations) {
		migrations.forEach(function (mig) {
			executed.push(mig.file);
		});
		for (var i = 0; i < files.length; i++) {
			if (executed.indexOf(files[i]) === -1) {
				pending.push(files[i]);
			}
		}
		return callback(null, pending);
	})
	.catch(function (err) {
		return callback(err);
	});
}

function executeMigrations(dir, pending, callback) {
	pending.forEach(function (file) {
		fs.readFile(dir + "/" + file, 'utf8', function (err, data){
			if (err) {
				return callback(err);
			}
			try {
				eval(data);
			} catch (e) {
				return callback(e);
			}
			Migration.create({ file: file }, function (err, migration) {
				if (err) {
					return callback(err);
				}
			});
		});
	});
	return callback(null, "Migrations have been done successfully!!");
}