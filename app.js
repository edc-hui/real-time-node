const http = require('http');
const socketIO = require("socket.io");
const app = require('express')();
const serve = http.createServer(app);
const io = socketIO(serve, {cors: true});// 解决跨域问题
const execute = require("./mysqlPool");

app.get('/', (req, response) => {
    response.send("当你看到这个页面的时候说明node实时数据库服务正常启动中......")
})

io.on("connection", (clientSocket) => {
    console.log("客户端与服务端建立了一个新的连接");
    let timer = null;
    let pageName = '页面一';
    timer = setInterval(() => {
        const sqlString = "select * from real_time_test";
        execute(sqlString, result => {
            if (pageName !== result[0].name && result.length > 0) { // 说明切换页面了
                clientSocket.emit("realtime", result[0].name)
                pageName = result[0].name;
            }
        })
    }, 500)

    // const send = () => {
    //     const sqlString = "select * from real_time_test";
    //     execute(sqlString,result => {
    //         console.log(result[0].name,'数据库中的页面名称')
    //         clientSocket.emit("realtime", result[0].name)
    //     })
    // }



    clientSocket.on('updateData', data => {
        const sqlString = `update real_time_test set name = '${data.name}' where id = 1 `;
        execute(sqlString, (result) => {
            const obj = {
                flag: 0,
                message: "更新数据成功",
                data: result
            };
            // send()
        })
    })

    clientSocket.on("disconnect", (data) => {
        console.log("客户端断开连接");
        if (timer) {
            clearInterval(timer);
        }
    });
})

serve.listen(8070, () => {
    console.log("实时数据库服务启动了，服务端口号为8070")
})

