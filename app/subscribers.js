var fcm = require('./fcm.js')
exports.getPersonSubscribers = function(data, notifyDb) {
	var tableMessage = "";
	var message = [];
	var updatedCol = [];
	var token = "";
	if (data.action_done == 'insert') {
		tableMessage = "Data inserted into Person at row id: "+data.row+ ", Name: "+data.personName+" & Mobile: "+data.number;
		message.push("New row added at id: " + data.row + "in Person");
		message.push(data.personName + " added at row id: "+data.row+" in table Person");
		message.push(data.number+" added at row id: "+data.row+" in table Person");
		updatedCol = ['person_id','name', 'mobile'];
	}
	else if(data.action_done == 'update') {
		tableMessage = "Data has been updated in Person at row id: "+data.row;
		if(!isEmpty(data.personName)){
			tableMessage += " with person name: "+data.personName;
			updatedCol.push('name');
			message.push("Name column updated, Person name: " + data.personName + " at row id: "+data.row);
		}
		if(!isEmpty(data.number)){
			if (updatedCol.length >= 1) {
				tableMessage += " & mobile: " + data.number;
			} else {
				tableMessage += " with mobile: " + data.number;
			}
			updatedCol.push('mobile');
			message.push("Mobile column updated, Mobile: " + data.number + " at row id: "+data.row);
		}
	}
	else if(data.action_done == 'delete') {
		tableMessage = "Data deleted from Person, row id: "+data.row;
		message.push("Row id: " + data.row + " deleted");
		message.push("Person name deleted from row id: "+data.row);
		message.push("Mobile deleted from row id: "+data.row);
		updatedCol = ['person_id', 'name', 'mobile'];		
	};
    notifyDb.getSubscribers(data, function(err, subscribers) {
		if (err) {
			console.log(err);
			return;
		};
		for(var i = 0; i < subscribers.length; i++) {
			if (subscribers[i].subscribe_coloumn == null) {
				token = subscribers[i].fcm;
				fcm.sendMessageToUser(token, tableMessage);
			}
			else if (subscribers[i].subscribe_coloumn !== null) {
				for(var j = 0; j < updatedCol.length; j++){
					if(subscribers[i].subscribe_coloumn == updatedCol[j]) {
						token = subscribers[i].fcm;
						fcm.sendMessageToUser(token, message[j]);
					}
				}
			}
		}
		return;
	});
}

exports.getCitySubscribers = function(data, notifyDb) {
	var tableMessage = "";
	var message = [];
	var updatedCol = [];
	var token = "";
	if (data.action_done == 'insert') {
		tableMessage = "Data inserted into City at row id: "+data.row+", values city name: "+data.city+", state: "+data.state+" & pincode: "+data.pincode;
		message.push("New row added in City at id: " + data.row);
		message.push(data.city + " added at row id: "+data.row+" in city");
		message.push(data.state+" added at row id: "+data.row+" in city");
		message.push(data.pincode+ " added at row id: "+data.row+" in city");
		updatedCol = ['city_id', 'city_name', 'state', 'pincode'];
	}
	else if(data.action_done == 'update') {
		tableMessage = "Data has been updated in City at row id: "+data.row;
		if(!isEmpty(data.city)){
			tableMessage += " with city name: "+data.city_name;
			updatedCol.push('city_name');
			message.push("City name updated: " + data.city+ " at row Id: "+data.row);
		}
		if(!isEmpty(data.state)){
			if (updatedCol.length >= 1) {
				tableMessage += " & state: " + data.state;
			} else {
				tableMessage += " with state: " + data.state;
			}
			updatedCol.push('state');
			message.push("State updated: " + data.state+ " at row Id: "+ data.row);
		}
		if(!isEmpty(data.pincode)){
			if (updatedCol.length >= 1) {
				tableMessage += " & pincode: " + data.pincode;
			} else {
				tableMessage += " with pincode: " + data.pincode;
			}
			updatedCol.push('pincode');
			message.push("Pincode updated: " + data.pincode+" at row Id: "+data.row);
		}		
	}
	else if(data.action_done == 'delete') {
		tableMessage = "Data deleted from City, row id: "+data.row;
		message.push("Row Id: " + data.row+ "deleted from City");
		message.push("City deleted from row id: "+data.row);
		message.push("State deleted from row id: "+data.row);
		updatedCol = ['city_id', 'city_name', 'state', 'pincode'];		
	};
    notifyDb.getSubscribers(data, function(err, subscribers) {
		if (err) {
			console.log(err);
			return;
		};
		for(var i = 0; i < subscribers.length; i++) {
			if (subscribers[i].subscribe_coloumn == null) {
				token = subscribers[i].fcm;
				fcm.sendMessageToUser(token, tableMessage);
			}
			else if (subscribers[i].subscribe_coloumn !== null) {
				for(var j = 0; j < updatedCol.length; j++){
					if(subscribers[i].subscribe_coloumn == updatedCol[j]) {
						token = subscribers[i].fcm;
						fcm.sendMessageToUser(token, message[j]);
					}
				}
			}
		}
		return;
	});
}

function isEmpty(value) {
	return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}