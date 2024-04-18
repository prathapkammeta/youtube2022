import Message from "../models/message.model.js";

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
    const conversattion = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    res.status(200).json(conversattion.messages);
    if (!conversattion) return res.status(200).json([]);
    const messages = conversattion.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in Message controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
