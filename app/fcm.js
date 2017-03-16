//to send message to user using fcm token

var request = require('request');


exports.sendMessageToUser = function(deviceId, message) {
		request({
				url: 'https://fcm.googleapis.com/fcm/send',
				method: 'POST',
				headers: {
						'Content-Type' : 'application/json',
						'Authorization': 'key=AAAAiMYnyjQ:APA91bFPDRID0rC8vlX75AEoRC7a0IaUPm-qAXd4FdX-up7vbB8rNvarmp64rhBwDopdlisEQT0NU3Fcf1HM6dOW_NJWnBfuho550wD2dtsOmMj5qIBIABzB8EXnERu3z3YznemBumqD'
				},
				body: JSON.stringify(
						{ "data": {
								"status": message
						},
								"to" : deviceId
						},
						{
								"priority" : "high",
						}
				)
		}, function(error, response, body) {
				if (error) { 
						console.error(error, response, body);
						return;
				}
				else if (response.statusCode >= 400) { 
						console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
						return;
				}
				else {
						console.log(body);
						console.log(response.statusCode);
						return;
				}
		});
}