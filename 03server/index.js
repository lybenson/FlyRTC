// 开启websocket服务
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ port: 8888 }),
  users = {};

// 监听connection方法
wss.on('connection', function (connection) {

  console.log('连接成功');

  // 监听客户端发送的消息
  connection.on('message', function (message) {
    var data;

    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log("JSON解析失败");
      data = {};
    }
    // data.type => 
    // login 登录
    // offer
    // answer
    // candidate
    // leave
    switch (data.type) {
      case "login":
        console.log("登陆成功，用户名为:", data.name);
        if (users[data.name]) { //已登录过的用户则登录失败
          sendTo(connection, {
            type: "login",
            success: false
          });
        } else { //未登录用户则加入已登陆用户的对象中
          users[data.name] = connection;
          connection.name = data.name;
          sendTo(connection, {
            type: "login",
            success: true
          });
        }

        break;
      case "offer":
        console.log("Sending offer to", data.name);
        var conn = users[data.name];

        if (conn != null) {
          connection.otherName = data.name;
          sendTo(conn, {
            type: "offer",
            offer: data.offer,
            name: connection.name
          });
        }

        break;
      case "answer":
        console.log("Sending answer to", data.name);
        var conn = users[data.name];

        if (conn != null) {
          connection.otherName = data.name;
          sendTo(conn, {
            type: "answer",
            answer: data.answer
          });
        }

        break;
      case "candidate":
        console.log("Sending candidate to", data.name);
        var conn = users[data.name];

        if (conn != null) {
          sendTo(conn, {
            type: "candidate",
            candidate: data.candidate
          });
        }

        break;
      case "leave":
        console.log("Disconnecting user from", data.name);
        var conn = users[data.name];
        conn.otherName = null;

        if (conn != null) {
          sendTo(conn, {
            type: "leave"
          });
        }

        break;
      default:
        sendTo(connection, {
          type: "error",
          message: "Unrecognized command: " + data.type
        });

        break;
    }
  });

  // 监听连接关闭事件
  connection.on('close', function () {
    if (connection.name) {
      delete users[connection.name];

      if (connection.otherName) {
        console.log("Disconnecting user from", connection.otherName);
        var conn = users[connection.otherName];
        conn.otherName = null;

        if (conn != null) {
          sendTo(conn, {
            type: "leave"
          });
        }
      }
    }
  });
});


function sendTo(conn, message) {
  conn.send(JSON.stringify(message));
}

// 开启websocket服务
wss.on('listening', function () {
  console.log("WebSocket服务正在监听8888端口...");
});
