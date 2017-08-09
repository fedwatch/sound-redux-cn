# SoundRedux-cn 中文源码解释版

SoundRedux-cn , 您可以通过本应用学习React + [redux](https://github.com/rackt/redux) + ES6 等等大量的技术细节,  [Soundcloud](http://soundcloud.com) 客户端项目。

Demo在线地址 https://soundredux.io

同时使用 [normalizr](https://github.com/gaearon/normalizr)

1. `npm install`
2. `npm run start`
3. 浏览器访问 `http://localhost:8080`

### 安装本地服务器

为了能让您使用用户认证的服务，请在本地服务器环境下，按以下步骤操作：

1. 确保已经安装了 [Go](https://golang.org/) 语言。
2. 确保 `sound-redux` 文件目录在你的 `$GOPATH`有设置
3. `$ cd server`
4. `$ go get .`
5. `$ go install .`

一次安装后即可使用:
`$ server`

欢迎提交Issues！
