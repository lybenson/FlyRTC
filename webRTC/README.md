WebRTC使用UDP协议
主要由以下的技术组成：
* RTCPeerConnection对象
* 信号传递和交涉
* 会话描述协议（SDP）
* 交互式连接建立（ICE）

### RTCPeerConnection
RTCPeerConnection对象是WebRTC API的主入口。通过它初始化一个连接、连接他人以及传送流媒体信息。

RTCPeerConnection对象是浏览器内一个简单对象，通过new初始化
```javascript
var myConnection = new RTCPeerConnection(configuration);
myConnection.onaddstream = function(stream) {
  // onaddstream事件的处理函数，当终端用户在对等连接中添加视频或音频流时事件触发
}
```
### 信号传递和交涉


### 创建WebRTC应用的步骤
* 创建一个RTCPeerConnection对象
* 创建SDP offer和回应
* 为双方找到ICE候选路径
* 创建一个成功的WebRTC连接
