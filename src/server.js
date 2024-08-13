import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
// import WebSocket, {WebSocketServer} from "ws";
const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (_, res) => res.render("home"));
// app.get("/*", (_, res) => res.redirect("/"));
const handleListen = () => console.log("Listening");
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
    socket.onAny((e)=>{
        console.log('e',e)
    })
  socket.on("enter_room", (roomName,done) => {
    socket.join(roomName);
    done();
    //roomName 에 있는 모든 사람에게 emit
    socket.to(roomName).emit("welcomeRoom");
  });
  socket.on("disconneting",()=>{
    socket.rooms.forEach((room)=>socket.to(room).emit("bye"));
  })
  socket.on("new_message",(msg,room,done)=>{
    socket.to(room).emit("new_message",msg);
    done();
  });
//   console.log(socket);
});
//webSocket

// const wss =  new WebSocketServer({server});

// function onSocketClose(){
//     console.log('브라우저연결끊김')
// }
// function onSocketMessage(message,isBinary,socket){
//     console.log(isBinary ? message : message.toString('utf8'));
//     socket.send(message.toString('utf8'));
// }
// const sockets = [];
// function handleConnection (socket) {
//     sockets.push(socket);
//     socket["nickname"] = "Anon"
//     console.log("브라우저 연결 성공");
//     socket.on('close',onSocketClose);
//     socket.on(" ",(msg,isBinary)=>{
//         const message = JSON.parse(isBinary ? msg : msg.toString('utf8'));
//         switch(message.type){
//             case "new_message" :
//                 sockets.forEach((aSocket)=>aSocket.send(`${socket.nickname} : ${message.payload}`));
//                 break;
//             case "nickname" :
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     });
//     socket.send("hello!!!");
// }

// wss.on("connection", handleConnection)

httpServer.listen(3000, handleListen);
