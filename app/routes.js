module.exports = function(app, configDb, notifyDb, fcm, session, subscribers) {

//index route
	app.get('/', isAuthenticated, function(req, res) {
			configDb.getTables(function(err, results) {
				if (err) {
					console.log(err);
					return ;
				}
				// res.render('indexq.jade', {results: results});
				configDb.getColumns(results[0].Tables_in_social, function(err, columns) {
					if(err) {
						console.log(err);
						return;
					}
					res.render('indexq.jade', {results: results, columns: columns});
					res.end();
				});
				// JSON.stringify(results);
			});
	});

//getColumns route, to show table columns (XMLHttpRequest)
	app.post('/getColumns', function(req, res) {
		// console.log(req.body);
		var response = "";
		configDb.getColumns(req.body.tablename, function(err, columns){
			if (err) {
				console.log(err);
				return;
			}
			for (var i = 0; i < columns.length; i++) {
				// console.log(columns[i].Field);
				response +="<option value="+columns[i].Field+" name="+columns[i].Field+">"+columns[i].Field+"</option>";
			}
			res.end(response);
			// console.log(columns);
		});
	});

//Sign in 
	app.get('/signin', function(req, res) {
		res.render('signin.jade');
		res.end();
	});

	app.post('/signin', function(req, res) {
		var email = req.body.email;
		notifyDb.insertUser(email, function(err, results){
			if(err) {
				console.log(err);
				res.redirect('/signin');
			};
			req.session.user = results;
			res.redirect('/');
		});   
	});

//Logout
	app.get('/logout', isAuthenticated, function(req, res){
		req.session.destroy();
		res.redirect('/signin');
	})

	//post subscription route, insert table or rows subscribed by the used in subscriber table.
	app.post('/subscribe', isAuthenticated, function(req, res) {
		var subscribeTable = req.body.selectPicker;
		var subscribeCol = [];
		if(req.body.hasOwnProperty('selectPickerCol')) {
			subscribeCol = req.body.selectPickerCol;
		}

		//sending subscribe data to server
		var user_id = req.session.user;
		notifyDb.insertSubscribe(user_id, subscribeTable, subscribeCol, function(err, results) {
			if (err) {
				console.log(err);
				res.redirect('/');
			};
			res.redirect('/');
		});
	});

//update fcm token of respective user in database
	app.post('/fcm', function(req, res) {
		var data = req.body;
		data.user_id = req.session.user;
		notifyDb.updateFcm(data, function(err, results) {
			if(err) {
				console.log(err);
				return;
			}
			res.end();
		})
	});

	app.get('/:tablename/edit', isAuthenticated, function(req,res){
		configDb.getId(req.params.tablename, function(err, results) {
			if(err) {
				console.log(err);
			};
			var rowIds = results;
			if (req.params.tablename == 'person') {
				res.render('editPerson.jade', {rowIds: rowIds});
				res.end();
			} else {
				res.render('editCity.jade', {rowIds: rowIds});
				res.end();
			}
		})
	});

	app.post('/person/insert', function(req,res){
		var data = req.body;
		data.tablename = 'person';
		configDb.insert(data, function(err, results) {
			if (err) {
				console.log(err);
				return;
			};
			// console.log(results);
			data.action_done = 'insert';
			data.row = results.insertId;
			subscribers.getPersonSubscribers(data, notifyDb);
			res.redirect('/');
		});
	});

	app.post('/person/update', function(req, res) {
		var data = req.body;
		data.tablename = 'person';
		configDb.update(data, function(err, results) {
			if (err) {
				console.log(err);
				return;
			};
			data.action_done = 'update';
			data.row = data.person_id;
			subscribers.getPersonSubscribers(data, notifyDb);
			res.redirect('/');
		});
	});

	app.post('/person/delete', function(req, res){
		var data = req.body;
		data.tablename = 'person';
		configDb.deleteId(data, function(err, results) {
			if (err) {
				console.log(err);
				return;
			};
			data.row = data.person_id;
			data.action_done = 'delete';
			subscribers.getPersonSubscribers(data, notifyDb);
			res.redirect('/');
		})
	});

	app.post('/city/insert', function(req,res){
		var data = req.body;
		data.tablename = 'city';
		configDb.insert(data, function(err, results) {
			if (err) {
				console.log(err);
				res.end();  
			};
			data.action_done = 'insert';
			data.row = results.insertId;
			subscribers.getCitySubscribers(data, notifyDb);
			res.redirect('/');
		});
	});

	app.post('/city/update', function(req, res) {
		var data = req.body;
		data.tablename = 'city';
		configDb.update(data, function(err, results){
			if (err) {
				console.log(err);
				res.end();
			};
			data.action_done = 'update';
			data.row = data.city_id;
			subscribers.getCitySubscribers(data, notifyDb);
			res.redirect('/');
		});
	});

	app.post('/city/delete', isAuthenticated, function(req, res){
		console.log('delete Operation');
		var data = req.body;
		data.tablename = 'city';
		configDb.deleteId(data, function(err, results) {
			if(err) {
				console.log(err);
				res.redirect('/city/edit');
			};
			data.row = data.city_id;
			data.action_done = 'delete';
			subscribers.getCitySubscribers(data, notifyDb);
			res.redirect('/');
		});
	});

	//function to check if user is authencticated
	function isAuthenticated(req, res, next) {
		if(req.session.user)
			return next();
		res.redirect('/signin');
	}

	function isEmpty(value) {
			return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
	}
}
