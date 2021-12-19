var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var port =  process.env.PORT || 4000;

users = [];

app.get("/", function (req, res) {
   res.sendFile(__dirname + "/ui.html");
   console.log("users",users);
 });

app.get("/reset", function (req, res) {
   users = []
   res.send("OK!")
 });

io.on("connection", function (socket) {
  console.log("A user connected");
  socket.on("setUsername", function (data) {
   //  console.log(data);
    if (users.indexOf(data) > -1) {
      socket.emit(
        "userExists",
        data + " username is taken! Try some other username."
      );
    } else {
      users.push(data);
      socket.emit("userSet", { username: data });
    }
  });
  socket.on("msg", function (data) {
    //Send message to everyone
    // console.log("--", data);
    io.sockets.emit("newmsg", data);
  });
});
http.listen(port, function () {
  console.log("listening on localhost:4000");
});
