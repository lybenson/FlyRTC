// 连接到服务器localhost:8888
var connection = new WebSocket('ws://localhost:8888'),
  name = "";

var loginPage = document.querySelector('#login-page'),
  usernameInput = document.querySelector('#username'),
  loginButton = document.querySelector('#login'),
  callPage = document.querySelector('#call-page'),
  theirUsernameInput = document.querySelector('#their-username'),
  callButton = document.querySelector('#call'),
  hangUpButton = document.querySelector('#hang-up');

callPage.style.display = "none";

// Login when the user clicks the button
loginButton.addEventListener("click", function (event) {
  name = usernameInput.value;

  if (name.length > 0) {
    send({
      type: "login",
      name: name
    });
  }
});

// 监听连接情况
connection.onopen = function () {
  console.log("连接到服务器成功");
};

// 监听来自服务器的消息
connection.onmessage = function (message) {
  console.log("收到消息", message.data);

  var data = JSON.parse(message.data);

  switch (data.type) {
    case "login":
      onLogin(data.success);
      break;
    case "offer":
      onOffer(data.offer, data.name);
      break;
    case "answer":
      onAnswer(data.answer);
      break;
    case "candidate":
      onCandidate(data.candidate);
      break;
    case "leave":
      onLeave();
      break;
    default:
      break;
  }
};

// 监听错误发生信息
connection.onerror = function (err) {
  console.log("发送错误: =>", err);
};

// 监听连接关闭
connection.onclose = function (evt) {
    console.log("连接关闭")
};

// 发送数据到服务器
function send(message) {
  if (connectedUser) {
    message.name = connectedUser;
  }
  // 发送消息给服务器
  connection.send(JSON.stringify(message));
};

function onLogin(success) {
  console.log(success);
  if (success === false) {
    alert("登陆失败,请更换用户名");
  } else {
    loginPage.style.display = "none";
    callPage.style.display = "block";

    // 准备好通话的通道
    startConnection();
  }
};

// 监听call按钮的点击
callButton.addEventListener("click", function () {
  var theirUsername = theirUsernameInput.value;

  if (theirUsername.length > 0) {
    startPeerConnection(theirUsername);
  }
});

// 监听 hang up 按钮的点击
hangUpButton.addEventListener("click", function () {
  send({
    type: "leave"
  });

  onLeave();
});

function onOffer(offer, name) {
  connectedUser = name;
  yourConnection.setRemoteDescription(new RTCSessionDescription(offer));

  yourConnection.createAnswer(function (answer) {
    yourConnection.setLocalDescription(answer);
    send({
      type: "answer",
      answer: answer
    });
  }, function (error) {
    alert("An error has occurred");
  });
}

function onAnswer(answer) {
  yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

function onCandidate(candidate) {
  yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function onLeave() {
  connectedUser = null;
  theirVideo.src = null;
  yourConnection.close();
  yourConnection.onicecandidate = null;
  yourConnection.onaddstream = null;
  setupPeerConnection(stream);
};

function hasUserMedia() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  return !!navigator.getUserMedia;
};

function hasRTCPeerConnection() {
  window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
  window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
  return !!window.RTCPeerConnection;
};

var yourVideo = document.querySelector('#yours'),
  theirVideo = document.querySelector('#theirs'),
  yourConnection, connectedUser, stream;

function startConnection() {
  if (hasUserMedia()) {
    navigator.getUserMedia({ video: true, audio: false }, function (myStream) {
      stream = myStream;
      yourVideo.src = window.URL.createObjectURL(stream);

      if (hasRTCPeerConnection()) {
        setupPeerConnection(stream);
      } else {
        alert("Sorry, your browser does not support WebRTC.");
      }
    }, function (error) {
      console.log(error);
    });
  } else {
    alert("Sorry, your browser does not support WebRTC.");
  }
};

function setupPeerConnection(stream) {
  var configuration = {
    "iceServers": [{ "url": "stun:127.0.0.1:9876" }]
  };
  yourConnection = new RTCPeerConnection(configuration);

  // Setup stream listening
  yourConnection.addStream(stream);
  yourConnection.onaddstream = function (e) {
    theirVideo.src = window.URL.createObjectURL(e.stream);
  };

  // Setup ice handling
  yourConnection.onicecandidate = function (event) {
    if (event.candidate) {
      send({
        type: "candidate",
        candidate: event.candidate
      });
    }
  };
};

function startPeerConnection(user) {
  connectedUser = user;

  // Begin the offer
  yourConnection.createOffer(function (offer) {
    send({
      type: "offer",
      offer: offer
    });
    yourConnection.setLocalDescription(offer);
  }, function (error) {
    alert("An error has occurred.");
  });
};
