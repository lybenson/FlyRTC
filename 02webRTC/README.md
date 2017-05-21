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
发送信令的步骤
1. 为一个对等连接创建潜在的候选列表
2. 用户或计算机算法将选择一个用户去连接
3. 信令层将通知那个用户有人想要去连接，用户可以选择接受或者拒绝
4. 连接请求被接受时，第一个用户会被通知
5. 若接受，第一个用户将初始化RTCPeerConnection
6. 双方将通过信令通道交换各自电脑的硬件和软件信息
7. 双方将通过信令通道交换各自电脑的位置信息
8. 用户之间的连接将成功或失败


### 创建WebRTC应用的步骤
* 创建一个RTCPeerConnection对象
* 创建SDP offer和回应
* 为双方找到ICE候选路径
* 创建一个成功的WebRTC连接
