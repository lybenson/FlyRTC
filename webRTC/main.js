function hasUserMedia() {
  navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  return !!navigator.getUserMedia;
}

function hasRTCPeerConnection() {
  window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  return !!window.RTCPeerConnection;
}

var yourVideo = document.querySelector("#yours");
var theirVideo = document.querySelector("#theirs");
var yourConnection;
var theirConnection;

if (hasUserMedia()) {
  navigator.getUserMedia({
    video: true,
    audio: false
  }, function (stream) {
    yourVideo.src = window.URL.createObjectURL(stream)

    if (hasRTCPeerConnection()) {
      startPeerConnection(stream);
    } else {
      alert('Sorry, 你的浏览器不支持WebRTC');
    }
  }, function (error) {
    alert('捕捉摄像机失败');
  })
} else {
  alert('Sorry, 你的浏览器不支持WebRTC')
}


function startPeerConnection(stream) {
  var configuration = {
    // iceServers: [{ url: '' }]
  };
  yourConnection = new RTCPeerConnection(configuration);
  theirConnection = new RTCPeerConnection(configuration);

  yourConnection.addStream(stream);
  theirConnection.onaddstream = function (e) {
    theirVideo.src = window.URL.createObjectURL(e);
  };


  // 创建ICE处理
  yourConnection.onicecandidate = function (event) {
    if (event.candidate) {
      theirConnection.addIceCandidate(new RTCIceCandidate(event.candidate))
    }
  };

  theirConnection.onicecandidate = function (event) {
    if (event.candidate) {
      yourConnection.addIceCandidate(new RTCIceCandidate(event.candidate))
    }
  };

  yourConnection.createOffer(function (offer) {
    yourConnection.setLocalDescription(offer);
    theirConnection.setRemoteDescription(offer);


    theirConnection.createAnswer(function (offer) {
      theirConnection.setLocalDescription(offer);
      yourConnection.setRemoteDescription(offer);

    })
  });
}

