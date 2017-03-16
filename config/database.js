//Database file for social table 

var mysql      = require('mysql');
var pool = mysql.createPool({
	connectionLimit : 100,
  host     : 'localhost',
  user     : 'root',
  password : '2335171',
  database : 'social',
});

exports.getTables = function(callback) {
	var sql = "show tables";

	//get a connection from pool
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			return;
		}
		//make query
		connection.query(sql, function(err, results) {
			connection.release();
			if (err) {
				console.log(err);
				return;
			}
			callback(false, results);
		});
	});
}

exports.getColumns = function(tablename, callback) {
	pool.getConnection(function(err, connection){
		if (err) {
			console.log(err);
			return;
		}
		connection.query("show columns from "+tablename, function(err, results) {
				if (err) {
					console.log(err);
					return;
				};
				callback(false, results)
			});
		// console.log(arr);
	})
}

exports.getId = function(tablename, callback) {
	var sql = '';
	if (tablename == 'person') {
		sql = "select person_id from person";
	}else {
		sql = "select city_id from city";
	}
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log(err);
			return;
		};
		connection.query(sql, null, function(err, results) {
			if(err) {
				console.log(err);
				return
			};
			callback(false, results);
		})
	})
}

exports.insert = function(data, callback) {
	var sql = "";
	var post = {};
	if(data.tablename == 'person') {
		if (isEmpty(data.personName) || isEmpty(data.number)) {
			console.log("Please fill all fields");
			return;
		};
		sql = "Insert into person SET ?";
		post = {name: data.personName, mobile: data.number}
	} else {
		if (isEmpty(data.city)|| isEmpty(data.state) || isEmpty(data.pincode)) {
			console.log("Please fill all the fields");
			return;
		};
		sql = "Insert into city SET ?";
		post = {city_name: data.city, state: data.state, pincode: data.pincode};
	}
	pool.getConnection(function(err, connection){
		if (err) {
			return;
		};
		connection.query(sql, post, function(err, results){
			if (err) {
				console.log(err);
			};
		callback(false, results);
		});
	})	
}

exports.update = function(data, callback) {
	var sql = "";
	var post = [];
	if (data.tablename == 'person') {
		if (isEmpty(data.personName) && isEmpty(data.number)) {
			console.log('nothing to update');
			return;
		}
		else if (!isEmpty(data.personName) && isEmpty(data.number)){
		//uppdate personName
			sql = "update person SET name = ? where person_id = ?";
			post = [data.personName, data.person_id];
			// console.log('update personName');
		}
		else if (isEmpty(data.personName) && !isEmpty(data.number)) {
			//update mobile
			sql = "update person SET mobile = ? where person_id = ?";
			post = [data.number, data.person_id];
			// console.log('update mobile');

		}
		else if (!isEmpty(data.personName) && !isEmpty(data.number)) {
			// console.log('update both');
			sql = "update person SET name = ?, mobile = ? where person_id = ?";
			post = [data.personName, data.number, data.person_id];
		}
	}else {
			if(!isEmpty(data.city) && isEmpty(data.state) && isEmpty(data.pincode)){
			sql = "update city SET city_name = ? where city_id = ?";
			post = [data.city, data.city_id];
		}
		else if (isEmpty(data.city) && !isEmpty(data.state) && isEmpty(data.pincode)) {
			sql = "update city SET state = ? where city_id = ?";
			post = [data.state, data.city_id];
		}
		else if(isEmpty(data.city) && isEmpty(data.state) && !isEmpty(data.pincode)) {
			sql = "update city SET state = ? where city_id = ?";
			post = [data.pincode, data.city_id];
		}
		else if (!isEmpty(data.city) && !isEmpty(data.state) && !isEmpty(data.pincode)) {
			sql = "update city SET city_name = ?, state = ?, pincode = ? where city_id = ?";
			post = [data.city, data.state, data.pincode, data.city_id];
		}
		else if (!isEmpty(data.city) && !isEmpty(data.state) && isEmpty(data.pincode)) {
			sql = "update city SET city_name = ?, state = ? where city_id = ?";
			post = [data.city, data.state, data.city_id];
		}
		else if (!isEmpty(data.city) && isEmpty(data.state) && !isEmpty(data.pincode)) {
			sql = "update city SET city_name = ?, pincode = ? where city_id = ?";
			post = [data.city, data.pincode, data.city_id];
		}
		else if (isEmpty(data.city) && !isEmpty(data.state) && !isEmpty(data.pincode)) {
			sql = "update city SET state = ?, pincode = ? where city_id = ?";
			post = [data.state, data.pincode, data.city_id];
		}
		else if (isEmpty(data.city) && isEmpty(data.state) && isEmpty(data.pincode)) {
			console.log("nothing to update");
			return;
		}
	}
	pool.getConnection(function(err, connection){
		if (err) {
			return;
		};
		connection.query(sql, post, function(err, results){
			if (err) {
				console.log(err);
			};
			console.log(results);
		callback(false, results);
		});
	});
}

exports.deleteId = function(data, callback) {
	//first fetch data before deleting row
	var sql = "";
	var post = [];
	if (data.tablename == 'person') {
		sql = "delete from person where person_id= ?";
		post = [data.person_id];
	} else {
		sql = "delete from city where city_id = ?";
		post = [data.city_id];
	}
	pool.getConnection(function(err, connection){
		if (err) {
			return;
		};
		connection.query(sql, post, function(err, results){
			if (err) {
				console.log(err);
			};
		callback(false, results);
		});
	});
}

exports.selectCity = function(id, callback) {
	var sql = "select * from city where city_id = ?";
	var post = [id];
	pool.getConnection(function(err, connection){
		if(err) {
			return;
		};
		connection.query(sql, post, function(err, results){
			if (err) {
				return;
			};
			callback(false, results[0]);
		});
	});
}

function isEmpty(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
} 