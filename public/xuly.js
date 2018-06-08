var socket = io("http://localhost:3000/");

socket.on("server-logon-fail", function (data) {
	alert("Tên đã tồn tại!!!");
});
// đăng nhập thành công
socket.on("server-logon-success", function (data) {
	$("#curUser").html(data);
	$("#form-login").hide(2000);
	$("#form-chat").show(1000);
});
// gửi mảng user về client
socket.on("server-list-data", function (data) {
	$("#userOnline").html("");
	data.forEach(function (i) {
		$("#userOnline").append("<div class='user'>"+i+"</div>");
	})
});
// xử lý chat
socket.on("server-send-message", function (data) {
	$ta = $("#list-message").append(data.un+": "+data.nd+"\n");
	$ta.scrollTop($ta[0].scrollHeight);
	$("#txtmessage").val("");
});

$(document).ready(function () {
	$("#form-login").show();
	$("#form-chat").hide();

	$("#btnLogin").click(function () {
		socket.emit("client-send-username",$("#txtUser").val());
	});

	$("#btnLogout").click(function () {
		socket.emit("logout");
		$("#form-login").show(1000);
		$("#form-chat").hide(2000);
	});

	$("#btnSend").click(function () {
		socket.emit("client-send-message",$("#txtmessage").val());
	});

	$("#txtmessage").focusin(function () {
		socket.emit("client-typing");
	});
	$("#txtmessage").onEnter(function () {
		alert("enter");
	});
});