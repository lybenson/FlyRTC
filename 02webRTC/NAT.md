NAT（Network Address Translation，网络地址转换）
就是通常我们处在一个路由器之下，而路由器分配给我们的地址通常为191.168.0.21 、191.168.0.22如果有n个设备，可能分配到192.168.0.n，而这个IP地址显然只是一个内网的IP地址，这样一个路由器的公网地址对应了n个内网的地址，通过这种使用少量的公有IP 地址代表较多的私有IP 地址的方式，将有助于减缓可用的IP地址空间的枯竭。





ICE，全名叫交互式连接建立（Interactive Connectivity Establishment）,一种综合性的NAT穿越技术，它是一种框架，可以整合各种NAT穿越技术如STUN、TURN（Traversal Using Relay NAT 中继NAT实现的穿透）。ICE会先使用STUN，尝试建立一个基于UDP的连接，如果失败了，就会去TCP（先尝试HTTP，然后尝试HTTPS），如果依旧失败ICE就会使用一个中继的TURN服务器。