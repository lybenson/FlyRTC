/**
 * Created by Benson on 2017/5/16.
 */

function hasUserMedia() {
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
}


// getUserMedia(streams, success, error);
// streams表示包括哪些多媒体设备的对象
// success回调函数，获取多媒体设备成功时调用
// error回调函数，获取多媒体设备失败时调用
// 发生错误时，回调函数的参数是一个Error对象，它有一个code参数 
// PERMISSION_DENIED：用户拒绝提供信息
// NOT_SUPPORTED_ERROR：浏览器不支持指定的媒体类型
// MANDATORY_UNSATISHIED_ERROR：指定的媒体类型未收到媒体流。
if (hasUserMedia()) {
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	navigator.getUserMedia({
		video: true,
		audio: false
	}, function (stream) {
		var video = document.querySelector('video');

		// video元素的src属性绑定数据流
		video.src = window.URL.createObjectURL(stream);
	}, function (err) {

	})
} else {
	alert('sorry')
}
