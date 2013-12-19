var express = require('express')
  , http = require('http')
  , path = require('path')
  , WebSocketServer = require('ws').Server
  , uuid = require('uuid')
  , colors = require('colors')
  , delim = "\n";


module.exports = function(PORT, params) {
  var app = express();

  // all environments
  app.set('port', PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }


  callbacks = {};
  var chunk = "";
  handleStdout = function(rawdata) {
    chunk += rawdata;
    while (chunk.indexOf(delim) > 0) {
      var idx = chunk.indexOf(delim);
      var result = chunk.slice(0, idx);
      chunk = chunk.slice(idx + delim.length).trim();
      // result = JSON.parse(result);
      result = result.split(' ');
      result = {
        _id: result[1],
        output: result[0]
      }

      if (callbacks[result._id]!=undefined) {
        callbacks[result._id](result);
        delete callbacks[result._id];
      } else {
        console.log(rawdata.toString().red);
      }
    }
  };

  /*
   *
   */
  handleStderr = function(data) {
    console.log(data.toString().green);
  };

  var vw = require('./vw')(handleStdout, handleStderr, params, delim, false);

  app.get('/', function(req, res) {
    res.send({ status: "up" });
  });

  app.get('/testpage', function(req, res) {
    res.render("index", { title: "vw node" });
  });

  app.post('/train', function(req, res) {
    var _id = uuid.v4();
    callbacks[_id] = function(data) {
      res.json(data);
    };
    vw.train(_id, req.body.features, req.body.label);
  });

  app.post('/predict', function(req, res) {
    var _id = uuid.v4();
    callbacks[_id] = function(data) {
      res.json(data);
    };
    vw.predict(_id, req.body.features);
  });

  var server = http.createServer(app);
  server.listen(app.get('port'), function(){
    console.log('listening on port ' + app.get('port'));
    console.log();
  });


  /*
  var wss = new WebSocketServer({server: server});
  wss.on('connection', function(ws) {
    ws.on('message', function(data) {
      data = JSON.parse(data);
      var _id = uuid.v4();
      callbacks[_id] = function(data) {
        ws.send(JSON.stringify(data));
      };
      vw.predict(_id, data.features);
    });
  });
  */
  var io = require('socket.io').listen(server, { log: false });
  io.sockets.on('connection', function (socket) {

    socket.on("train", function(data) {
      var _id = uuid.v4();
      callbacks[_id] = function(data) {
        socket.emit("train", data);
      };
      vw.train(_id, data.features, data.label);
    });

    socket.on("predict", function(data) {
      var _id = uuid.v4();
      callbacks[_id] = function(data) {
        socket.emit("predict", data);
      };
      vw.predict(_id, data.features);
    });

  });

}
