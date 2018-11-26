const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true, required: true },
    password: String,
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    lastVisit: Date,
  },
  { timestamps: true },
);

userSchema.pre('save', function save(next) {
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

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

const model = mongoose.model('User', userSchema);
model.userSchema = userSchema;

module.exports = model;
