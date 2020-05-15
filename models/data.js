var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    author:{
        type:String
    },
    books:{
        type:String
    },
    date: {
      type: Date,
      default: Date.now
    }
});

module.exports =  mongoose.model('books',bookSchema);
