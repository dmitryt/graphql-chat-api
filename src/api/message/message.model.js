const mongoose = require('mongoose');

const { userSchema } = require('../user/user.model');

const messageSchema = new mongoose.Schema(
  {
    sender: userSchema,
    content: String,
    statusMessage: Boolean,
  },
  { timestamps: true },
);

const model = mongoose.model('Message', messageSchema);
model.messageSchema = messageSchema;

module.exports = model;
