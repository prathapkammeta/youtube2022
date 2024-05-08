import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./socket/socket.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
dotenv.config();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();
app.get("/", (req, res) => {
  //root route http://localhost:5000/
  res.send("hellodd world");
});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
//express.static usually serve html css javascript files  in our frontend application
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
