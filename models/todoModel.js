var mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
    task: String,
});

module.exports = mongoose.model('Todo', todoSchema);
