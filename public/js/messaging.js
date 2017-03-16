  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD6nFARXAVjN34bVcdCoCJVIsMgfGaLR28",
    authDomain: "notification-cc71c.firebaseapp.com",
    databaseURL: "https://notification-cc71c.firebaseio.com",
    storageBucket: "notification-cc71c.appspot.com",
    messagingSenderId: "587440048692"
  };
  firebase.initializeApp(config);

  const messaging = firebase.messaging();

messaging.requestPermission()
.then(function() {
  console.log('Notification permission granted.');
  // TODO(developer): Retrieve an Instance ID token for use with FCM.
  // ...
  return messaging.getToken();
})
.then(function(token){
  console.log(token);
  sendTokenToServer(token);
}) 
.catch(function(err) {
  console.log('Unable to get permission to notify.', err);
})

messaging.onMessage(function(payload){
  var notification = payload.data.status;
  console.log(notification);
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(notification));
  document.getElementById('notification').appendChild(li);
});

function sendTokenToServer(token) {
  var xhttp = new XMLHttpRequest(); 
  var params = "token="+token; 
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      return;
    } 
  }
  xhttp.open("POST","http://localhost:3000/fcm", true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send(params);
}