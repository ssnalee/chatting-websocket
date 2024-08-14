const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form#roomName");
const nameForm = welcome.querySelector("form#nickname");
const room = document.getElementById("room");
room.hidden = true;
form.style.display = "none";
let roomName;

function addMessage(msg,type){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    const nickname = msg.split(" ")[0];
    const message = msg.split(" ")[1];
    li.innerHTML = `<img src="./public/img/profile.png" /><span>${nickname}</span><p>${message}</p> `;
    if(type) li.classList.add("self");
    ul.appendChild(li);
}
function handleMessageSubmit(e){
    e.preventDefault();
    const input = room.querySelector("#message input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName,()=>{
        addMessage(`You ${value}`,'self');
    });
    input.value ="";
}
function handleNicknameSubmit (e){
    e.preventDefault();
    const input = nameForm.querySelector("#nickname input");
    const value = input.value;
    console.log(value);
    socket.emit("nickname",value,showRoomList);
}
function handleRoomSubmit(e){
    e.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value,showRoom);
    roomName = input.value;
    input.value = "";
};
function showRoom (){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const form = room.querySelector("form#message");
    form.addEventListener("submit",handleMessageSubmit);
}
function showRoomList() {
    nameForm.style.display = "none";
    form.style.display = "flex";
}
form.addEventListener("submit",handleRoomSubmit);
nameForm.addEventListener("submit",handleNicknameSubmit);
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