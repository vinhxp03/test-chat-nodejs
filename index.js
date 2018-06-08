var express = require("express");
var app = express();
app.use(express.static("public")) // cho phép user truy cập vào thư mục public
app.set("view engine","ejs");
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var arrUser=[]; // mảng user
// bat ket noi user 
io.on("connection", function (socket) {	
	console.log("Connected " + socket.id);
	
	socket.on("disconnect", function () {	
		console.log(socket.id + " Disconnected");
	});

	//xử lý đăng nhập
	socket.on("client-send-username", function (data) {
		if (arrUser.indexOf(data)>=0) {
			// kết nối thất bại
			socket.emit("server-logon-fail",data)
		}else{
			// kết nối thành công
			arrUser.push(data);
			socket.username = data; // gán cho client 1 cái username
			socket.emit("server-logon-success",data);
			io.sockets.emit("server-list-data", arrUser); // gửi dữ liệu user về
		}
	});
	socket.on("logout",function () {
		arrUser.splice(arrUser.indexOf(socket.username),1); // xóa user logout
		socket.broadcast.emit("server-list-data", arrUser);
	});

	// xử lý chat
	socket.on("client-send-message",function (data) {
		io.sockets.emit("server-send-message", {un:socket.username,nd:data}); // truyền JSON về client
	});

	socket.on("client-typing",function () {
		console.log(socket.username + " đang viết.");
	});
});

app.get("/", function(req,res) {
	res.render("layout");
});
//io.sockets.emit("server-send-data", data); // send đến toàn bộ client
//socket.emit("Server-send-data", data); // send đến client gửi data
//socket.broadcast.emit("Server-send-data", data); // send đến toàn bộ client trừ client send data