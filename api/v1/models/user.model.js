const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  token: String,
  role: String,
  slug: {
    type: String,
    slug: 'fullName',
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;