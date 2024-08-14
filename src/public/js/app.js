const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
room.hidden = true;

let roomName;

function addMessage(msg){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}
function handleMessageSubmit(e){
    e.preventDefault();
    const input = room.querySelector("#message input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName,()=>{
        addMessage(`You : ${value}`);
    });
    input.value ="";
}
function handleNicknameSubmit (e){
    e.preventDefault();
    const input = room.querySelector("#nickname input");
    const value = input.value;
    socket.emit("nickname",input.value)
}
function showRoom (){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const form = room.querySelector("form#message");
    const nameForm = room.querySelector("form#nickname");
    form.addEventListener("submit",handleMessageSubmit);
    nameForm.addEventListener("submit",handleNicknameSubmit);
}
function handleRoomSubmit(e){
    e.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value,showRoom);
    roomName = input.value;
    input.value = "";
};
form.addEventListener("submit",handleRoomSubmit);

socket.on("welcomeRoom",(nickname,newCount)=>{
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${nickname} joined`);
})
socket.on("bye",(nickname,newCount)=>{
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${nickname} left`);
});
socket.on("new_message",addMessage);
socket.on("room_change",(rooms)=>{
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(roomList.length === 0) return;
    rooms.forEach((room, idx)=>{
        const li = document.createElement("li");
        li.innerText = `Room ${idx + 1} : ${room}`;
        roomList.appendChild(li);
    })
});
//webSocket
// const messageList = document.querySelector("ul");
// const messageForm = document.querySelector("form#message");
// const nickForm = document.querySelector("form#nick");
// const socket = new WebSocket(`ws://${window.location.host}`);
// let testValue = "";
// function makeMassage(type,payload){
//     const msg = {
//         type : type,
//         payload : payload
//     }
//     return JSON.stringify(msg);
// }

// function handleOpen(){
//     console.log("서버 연결 성공");
// }
// function handleMessage(message){
//     console.log('a',message.data);
//     if(testValue != message.data.split(":")[0].trim()){
//         const li = document.createElement("li");
//         li.innerText = message.data;
//         messageList.appendChild(li);
//     }
// }
// function handleClose(){
//     console.log('서버 연결 끊김');
// }

// socket.addEventListener("open",handleOpen);
// socket.addEventListener("message",handleMessage);
// socket.addEventListener("close",handleClose);

// // setTimeout(()=>{
// //     socket.send("hello from th browser!");
// // },5000);

// function handleSubmit(e){
//     e.preventDefault();
//     const input = messageForm.querySelector('input');
//     socket.send(makeMassage("new_message", input.value));
//     const li = document.createElement("li");
//     li.innerText = `You: ${input.value}`;
//     messageList.appendChild(li);
//     input.value = "";
// }
// function handleNickSubmit(e){
//     e.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMassage("nickname", input.value));
//     testValue = input.value;
//     input.value = "";
// }
// messageForm.addEventListener("submit",handleSubmit);
// nickForm.addEventListener("submit",handleNickSubmit);