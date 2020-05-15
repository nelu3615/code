const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type:String, 
    //validate:{ validator: validator.isEmail },
    required: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ["user", "publisher"]
   },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('users', UserSchema);