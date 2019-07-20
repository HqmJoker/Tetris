var app = require("http").createServer();
var io = require("socket.io")(app);

var PORT = 3003;

app.listen(PORT);

var clientCount = 0;
//客户端匹配
var clientMap = {};

//绑定事件
var bandEvents = function(socket, event){
    socket.on(event,function(data){
        if(clientMap[socket.clientNum]){
            if(socket.clientNum % 2 === 0){
                clientMap[socket.clientNum - 1].emit(event, data);
            }else{
                clientMap[socket.clientNum + 1].emit(event, data);
            }
        }
    });
};

io.on("connection", function(socket){
    clientCount++;
    console.log("user "+ clientCount +" comes in!");
    socket.clientNum = clientCount;
    clientMap[clientCount] = socket;

    if(clientMap[socket.clientNum]){
        if(clientCount % 2 !== 0){
            socket.emit("waiting","Waiting for another person!!!");
        }else{
            socket.emit("start");
            clientMap[clientCount-1].emit("start");
        }
    }
    bandEvents(socket, "init");
    bandEvents(socket, "performNext");
    bandEvents(socket, "rotate");
    bandEvents(socket, "moveRight");
    bandEvents(socket, "moveDown");
    bandEvents(socket, "moveLeft");
    bandEvents(socket, "fall");
    bandEvents(socket, "time");
    bandEvents(socket, "fixed");
    bandEvents(socket, "addScore");
    bandEvents(socket, "stop");
    bandEvents(socket, "addTailLines");
    bandEvents(socket, "syncCreateLines");
    socket.on("disconnect", function(){
        if(clientMap[socket.clientNum]){
            if(socket.clientNum % 2 === 0){
                clientMap[socket.clientNum - 1].emit("leave");
            }else{
                clientMap[socket.clientNum + 1].emit("leave");
            }
        }
    });
});

console.log("server is listening on port:" + PORT);

