var http = require('http');
var fs = require('fs');
var path = require('path');
var io = require('socket.io');
var Reddit = require('handson-reddit');


var httpServer = http.createServer(function(request, response) {
	var filePath = '.' + request.url;
	if(filePath == "./") {
		filePath = "./index.html";
	}
	var extension = path.extname(filePath);
	var contentType = 'text/html';

	switch(extension) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case ".css":
			contentType = 'text/css';
			break;
	}

	fs.exists(filePath, function(existing) {
		if(existing) {
			fs.readFile(filePath, function(error, content) {
				if(error) {
					response.writeHead(500);
					response.end();
				} else {
					response.writeHead(200, {'Content-Type': contentType});
					response.end(content, 'utf-8');
				}
			});
		} else {
			response.writeHead(404);
			response.end();
		}
	});
}).listen(8000);

io = io.listen(httpServer);
//io.set('log level', 1);

var reddit = new Reddit();

function recurseCheck(socket) {
	var paused = false;

	if (socket == undefined) {
		for (var i = 0; i < recurseArray.length; i++) {
			clearTimeout(recurseArray[i]);
			console.log('ended');

		};
	}

	var thing = setTimeout(function() {
		reddit.r('cats/new/', function(err, results) {
			console.log(JSON.parse(results.body).data.children[2]);
			catPosts = JSON.parse(results.body).data.children;
			for (var i = 0; i < catPosts.length; i++) {
				child = catPosts[i];
				//console.log(child);
				cats[child.data.url] = true;
				var picToSend = child.data.url;
				console.log("This is the title: " + child.data.url);
				socket.emit("cat_callback", picToSend);

				setTimeout(function() {
					paused = false;
				}, 2000);
				while(paused == true) {

				}
			};
		});
		recurseCheck(socket);
	}, 5000);
	recurseArray.push(thing);
}




var cats = [];
var recurseArray = new Array();

io.sockets.on('connection', function(socket) {
	console.log("connected");
	recurseCheck(socket);
	//socket.on('chat_message', function(data) {
	//	console.log("Message Received " + data);
		//socket.broadcast.emit('chat_callback', data);
	//});
})
