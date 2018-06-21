const mongoose = require('mongoose');

const { messageSchema } = require('../message/message.model');

const chatSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messages: [messageSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Chat', chatSchema);
