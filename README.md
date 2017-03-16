# socialNotification
Notification system using Node.js

# Synopsis
Basic functionality of a notification system is sending message message to a single user or a group of user. This application
let user subscribe to tables or to the column of a table in a database on change in database subscribers receive notifications.

# Approach
### Approach to the problem was dividing the problems in sub-problems:
- User subscribe to table or column in a table.
- Track changes being made in database
- Fetch user from database depending on the field or table.
- Sending notification to the user

Tools considered for the application was Node.js, Php, MySql, MongoDb, firebase and soket.io. Reason for opting **Node.js** over Php
is because of vast modules or packages available on NPM which makes it easier to develop application more efficiently. **MySql** and 
**Firebase** is opted due to familarity with the tools.

# Installation
Clone or download repository from github (https://github.com/pratcurve/socialNotification.git). Make sure MySql and Node.js is
installed or download:
Node.js: https://nodejs.org/en/download/ . Node.js installation will also install NPM.
MySql: https://dev.mysql.com/downloads/

Go to project root folder using terminal and write
```
$ npm install
```
Npm will install all the modules required for the application mentioned in package.json.

```
{
  "name": "social_notify",
  "version": "0.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "BSD-2-Clause",
  "dependencies": {
    "assert-plus": "^1.0.0",
    "asynckit": "^0.4.0",
    "body-parser": "^1.17.1",
    "express": "~4.15.2",
    "express-session": "^1.15.1",
    "firebase": "~3.7.0",
    "jade": "^1.11.0",
    "mysql": "^2.13.0",
    "request": "^2.81.0",
    "xmlhttprequest": "^1.8.0"
  }
}
```
Change user and password value in database connection in notifyDb.js
```
var pool = mysql.createPool({
	connectionLimit : 100,
  host     : 'localhost',
  user     : '/Your username/',
  password : '/your MySql user password/',
  database : 'notify',
});
```
Change user and password value for database connection in database.js
```
var pool = mysql.createPool({
	connectionLimit : 100,
  host     : 'localhost',
  user     : '/Your username/',
  password : '/your MySql user password/',
  database : 'social',
});
```
From project root folder run command
```
$ node server.js
```
To access local host from machine other than the machine on which localhost is running, port forwarding has to be done for smooth working of application.<br>
For port forwarding on linux: http://askubuntu.com/questions/320121/simple-port-forwarding
on Windows: http://stackoverflow.com/questions/11525703/port-forwarding-in-windows
```
listenport=3000
listenaddress=127.0.0.1
connectport=3000
connectaddress=ip4 server machine
```

And the application will run on http://localhost:3000. <br>
# References
express-session: https://github.com/expressjs/session<br>
mysql: https://www.npmjs.com/package/mysql<br>
stack overflow: http://stackoverflow.com/<br>
node.js: https://nodejs.org/dist/latest-v6.x/docs/api/<br>
Firebase: https://firebase.google.com/docs/database/web/start<br>
XMLHttpRequest: https://www.w3schools.com/xml/xml_http.asp<br>

