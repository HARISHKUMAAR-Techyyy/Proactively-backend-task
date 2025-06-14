require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const formRoutes = require("./routes/routesform");
const db = require("./db/connection");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", formRoutes);

// WebSocket
io.on("connection", (socket) => {
  console.log("🟢 A user connected");

  socket.on("field-update", async ({ id, value }) => {
    try {
      await db.query("UPDATE fields SET value = ? WHERE id = ?", [value, id]);
      socket.broadcast.emit("update-field", { id, value });
    } catch (error) {
      console.error("❌ Error updating field via WebSocket:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected");
  });
});

// Server listen
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
