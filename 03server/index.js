var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8888 });

wss.on('connection', function (connection) {
  console.log('连接成功')

  connection.on('message', function (message) {
    console.log('收到信息' + message);
  });

  connection.send('hello');
});