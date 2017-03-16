importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

	var config = {
		apiKey: "AIzaSyD6nFARXAVjN34bVcdCoCJVIsMgfGaLR28",
		authDomain: "notification-cc71c.firebaseapp.com",
		databaseURL: "https://notification-cc71c.firebaseio.com",
		storageBucket: "notification-cc71c.appspot.com",
		messagingSenderId: "587440048692"
	};
	firebase.initializeApp(config);

	const messaging = firebase.messaging();

	messaging.setBackgroundMessageHandler(function(payload) {
		const title = "Notify";
		const options = {
			body : payload.data.status
		};
		return self.registration.showNotification(title, options);
	});