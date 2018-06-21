const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: String,
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    lastVisit: Date,
  },
  { timestamps: true },
);

userSchema.pre('save', (next) => {
  const user = this;
  if (!user.isModified('password')) return next();

  return bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    return bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);

      user.password = hash;
      return next();
    });
  });
});

userSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
