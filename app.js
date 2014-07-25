var express = require('express')
  , app = express()
  , routes = require('./routes')
  , path = require('path')
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

server.listen(app.get('port'));

/*************************************************************/

var usernames = {};

io.set('log level', 0); // 0 to not take log
/***************** Events *****************/


io.sockets.on('connection', function (socket) {
	// Add user
  	socket.on('adduser', function (username,color) {
		socket.username = username;		
		usernames[socket.username] = {username:socket.username,color:color };
		socket.emit('updatechat', getUserData("System","You are connected.","red"));
	 	io.sockets.emit('updatechat', getUserData("System","["+socket.username+"] has connected.","red"));				
		console.log(socket.username+" has connected.");	
	});
	
	// Send chat
	socket.on('sendmsg', function (msg) {
	 	io.sockets.emit("updatechat",getUserData(socket.username,msg,usernames[socket.username].color));
		console.log(socket.username+" : "+msg);	
	});
	
	// Disconnect
	socket.on('disconnect', function () {
		if(socket.username != undefined)
		{
			delete usernames[socket.username];
	
			io.sockets.emit('updatechat',getUserData("System","["+socket.username+"] has disconnected..","red"));
			console.log(socket.username+" has disconnected..");		
		}
	});
});

/***************** Functions *****************/

function getUserData(nick,msg,color)
{
	return { nick:nick,msg:msg,color:color }; 
}



