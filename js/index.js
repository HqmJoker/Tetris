var socket = io("ws://49.234.178.27:3003");
var local = new Local(socket);
var remote = new Remote(socket);

socket.on("waiting", function(str){
    document.getElementById("waiting").innerHTML = str;
    document.getElementById("waiting").style.color = "blue";
});
