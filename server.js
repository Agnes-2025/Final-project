const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});

// Port settings (Render automatic ga port isthundi, lekapothe 3000)
const PORT = process.env.PORT || 3000;

console.log("SafeNest Cloud Server is starting...");

io.on("connection", (socket) => {
  console.log("Someone connected: " + socket.id);

  // 1. Identify who is connecting (Parent or Child)
  socket.on("identify", (data) => {
    if (data.type === "child") {
      socket.join("children");
      console.log("Child Device (Emma) is now ONLINE.");
    } else if (data.type === "parent") {
      socket.join("parents");
      console.log("Parent Dashboard is now ONLINE.");
    }
  });

  // 2. Listen for 'lock' command from Parent
  socket.on("parent-command", (data) => {
    console.log("Parent sent command: " + data.action);
    // Send this command only to the children
    io.to("children").emit("child-action", { action: data.action });
  });

  socket.on("disconnect", () => {
    console.log("Someone went offline.");
  });
});

// Server start chesthundi
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});