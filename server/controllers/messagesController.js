const { model } = require("mongoose");
const messageModel = require ("../model/messageModel");
const UserModel = require("../model/userModel");

module.exports.addMessage = async (req,res,next) => {
    try {
        const {from, to , message } = req.body;

        const existingMessage = await messageModel.findOne({users: [from, to]});
        if(existingMessage) {
            const data = await messageModel.create({
                message: {text: message},
                users: [from ,to],
                sender: from,
            });
            return res.json({msg: "Message added successfully"});
        } else {
            const data = await messageModel.create({
                message: { text: message },
                users: [from, to],
                sender: from,
            });
            const receiver = await UserModel.findById(to);
            if(receiver && !receiver.contacts.includes(from)) {
                receiver.contacts.push(from);
                await receiver.save();
            }
            return res.json({msg: "Message added successfully."});
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllMessage = async (req,res,next) => {
    try {
        const {from, to} =  req.body;
        const messages = await messageModel
            .find({
                users: {
                    $all: [from, to],
                },
            })
            .sort({updatedAt: 1});
        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,

            };
        });
        res.json(projectMessages);
    } catch (ex) {
        next (ex);
    }
};
