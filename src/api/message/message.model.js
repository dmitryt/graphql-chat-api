const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    statusMessage: Boolean,
  },
  { timestamps: true },
);

const model = mongoose.model('Message', messageSchema);
model.messageSchema = messageSchema;

module.exports = model;
