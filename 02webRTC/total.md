WebRTC共分三个API。

* MediaStream（又称getUserMedia）
* RTCPeerConnection
* RTCDataChannel

MediaStream 获取用户媒体信息

RTCPeerConnection用于浏览器之间点对点的连接

RTCDataChannel用于点对点的数据通信

WebRTC使用RTCPeerConnection来在浏览器之间传递流数据，这个流数据通道是点对点的，不需要经过服务器进行中转。但是这并不意味着我们能抛弃服务器，我们仍然需要它来为我们传递信令（signaling）来建立这个信道

WebRTC没有定义用于建立信道的信令的协议，既然没有定义具体的信令的协议，我们就可以选择任意方式（AJAX、WebSocket），采用任意的协议（SIP、XMPP）来传递信令，建立信道，

需要信令来交换的信息有三种：
* session的信息：用来初始化通信还有报错
* 网络配置：比如IP地址和端口啥的
* 发送方和接收方的浏览器能够接受什么样的编码器和分辨率