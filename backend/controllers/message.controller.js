import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

import Conversation from "./../models/conversation.model.js";
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // await conversation.save();
    // await newMessage.save();
    // instead doing both save here we are using promises.all this will run in parallel

    await Promise.all([conversation.save(), newMessage.save()]);
    //SOCKET ID FUNCTIONALITY WILL GO HERE

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      //io.to(socket_id).emit() used to send events to specific client

      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
    //console.log("message send", req.params.id);
  } catch (error) {
    console.log("Error in Message controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]); // Check before sending response
    const messages = conversation.messages;
    res.status(200).json(messages); // Send response here
  } catch (error) {
    console.log("Error in Message controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
