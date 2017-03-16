
// database configuration file for notification database

var mysql      = require('mysql');
var pool = mysql.createPool({
	connectionLimit : 100,
  host     : 'localhost',
  user     : 'root',
  password : '2335171',
  database : 'notify',
});


exports.insertUser = function(email, callback) {
	var sql = "Insert into user SET ?";
	var post = {email: email, fcm: null};
	pool.getConnection(function(err, connection){
		if (err) {
			console.log(err);
			callback(true, "Error");
		};
		connection.query("select user_id from user where email = ?", [email], function(err, result) {
			if(err) {
				console.log(err);
				callback(true, "Error");
			};
			if(result.length <= 0) {
				connection.query(sql, post, function(err, result){
					if (err) {
						console.log(err);
						callback(true, "Error in query");
					};
					connection.release();
					callback(false, result.insertId);
				});				
			} else {
				connection.release();
				callback(false, result[0].user_id);
			}
		});
	});
}


//Updates fcm of user 

exports.updateFcm = function(data, callback) {
	var sql = "update user SET fcm = ? where user_id = ?";
	var post = [data.token, data.user_id];
	pool.getConnection(function(err, connection){
		if (err) {
			console.log(err);
			callback(true, "Error");
		};
		connection.query(sql, post, function(err, result){
			if(err){
				console.log(err);
				callback(true, "Error in query");
			};
			connection.release();
			callback(false, result);
		})		
	})
}

//insert table and coloumns subscribed by user
exports.insertSubscribe = function(user_id, subscribeTable, subscribeCol, callback) {
	var sql = "Insert into subscribe SET ?";
	pool.getConnection(function(err, connection) {
		if (err) {console.log(err)
			return;
		};
		if(subscribeCol.length == 0) {
			post = {user_id: user_id, subscribe_table: subscribeTable[0], subscribe_coloumn: null}
			connection.query(sql, post, function(err, result){
				if(err) {
					console.log(err);
					connection.release();
					return;
				}
				connection.release();
				callback(false, result);
			});
		} else {
			for(var i = 0; i < subscribeCol.length; i++) {
				post = {user_id: user_id, subscribe_table: subscribeTable[0], subscribe_coloumn: subscribeCol[i]};
				connection.query(sql, post, function(err, result) {
					if(err) {
						console.log(err);
						connection.release();
						return;
					}
				});
			}
			connection.release();
			callback(false, "result");
		}
	});		
}

//Return subscriber of mentioned table
exports.getSubscribers = function(data, callback) {
	var sql = "SELECT user.user_id, user.email, user.fcm, subscribe.subscribe_table, subscribe.subscribe_coloumn " +
				"FROM subscribe, user "+
				"WHERE subscribe.user_id = user.user_id "+
				"AND subscribe.subscribe_table = ?";
	// var subscribers;
	//pool connection
	// console.log(sql);
	if (data.tablename == 'person') {
		post = [data.tablename];
	} else {
		post = [data.tablename];
	}
	// console.log(post);
	pool.getConnection(function(err, connection){
		if (err) {
			console.log(err);
			return;
		};
		connection.query(sql, post, function(err, subscribers) {
			if (err) {
				console.log;
				return;
			} 
			connection.release();
			callback(false, subscribers);
		});
	});
}