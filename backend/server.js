import express from "express";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  //root route http://localhost:5000/
  res.send("hellodd world");
});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
