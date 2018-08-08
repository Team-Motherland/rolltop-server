const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const NoteSchema = new Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  //owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Note', NoteSchema);
