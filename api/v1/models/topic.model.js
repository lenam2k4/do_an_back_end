const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const topicSchema = new mongoose.Schema({
  name: String,
  thumbnail: String,
  slug: {
    type: String,
    slug: 'name',
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

const Topic = mongoose.model('Topic', topicSchema, 'topics');

module.exports = Topic;