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

chatSchema.virtual('isChatMember')
  .set(function set(userId) {
    this._isChatMember = this.members.includes(userId);
  })
  .get(function get() {
    return this._isChatMember;
  });

chatSchema.virtual('isChatCreator')
  .set(function set(userId) {
    this._isChatCreator = this.creator.toString() === userId;
  })
  .get(function get() {
    return this._isChatCreator;
  });

module.exports = mongoose.model('Chat', chatSchema);
