const http = require('http');
const socketIO = require("socket.io");
const app = require('express')();
const serve = http.createServer(app);
const io = socketIO(serve,{ cors: true });// 解决跨域问题

app.get('/',(req,response)=>{
    response.send("当你看到这个页面的时候说明node实时数据库服务正常启动中......")
})

io.on("connection", (clientSocket) => {
    console.log("客户端与服务端建立了一个新的连接");
    let num = 1;
    clientSocket.emit("init",num)
    setInterval(()=>{
        num++
        if(num > 3){
            num = 1;
        }
        clientSocket.emit("init",num)
    },3000)
})

serve.listen(8070, () => {
    console.log("实时数据库服务启动了，服务端口号为8070")
})

